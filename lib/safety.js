import { mkdir, readFile, writeFile, rename, lstat, appendFile } from "node:fs/promises";
import { actionRestriction, credentialPath, guardianPath } from "./command-safety.js";
import { realpathSync, writeFileSync, readFileSync, lstatSync, unlinkSync, createReadStream } from "node:fs";
import path from "node:path";
import { randomUUID, createHash } from "node:crypto";
const rank = { "read-only": 0, "workspace-write": 1, "danger-full-access": 2 };
const initial = () => ({ version: 1, revision: 0, reviewRequired: true, sandboxCeiling: "inherit", blockedTools: [], maxOutputTokens: 0 });
const denied = (message) => Object.assign(new Error(message), { code: "STRONGER_SAFETY_POLICY" });
function within(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || relative !== ".." && !relative.startsWith(".." + path.sep) && !path.isAbsolute(relative);
}
function physical(file) {
  let current = path.resolve(file), tail = [];
  for (; ; ) {
    try {
      return path.join(realpathSync(current), ...tail.reverse());
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      const parent = path.dirname(current);
      if (parent === current) throw error;
      tail.push(path.basename(current));
      current = parent;
    }
  }
}
function restoreLease(file) {
  const token = randomUUID(), content = JSON.stringify({ pid: process.pid, token });
  const take = () => writeFileSync(file, content, { flag: "wx", mode: 384 });
  try {
    take();
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    const info = lstatSync(file);
    if (!info.isFile() || info.nlink > 1) throw denied("恢复锁文件异常，操作已停止");
    const old = readFileSync(file, "utf8");
    let previous;
    try {
      previous = JSON.parse(old);
    } catch {
      throw denied("恢复锁文件损坏，请检查本机诊断");
    }
    if (!Number.isInteger(previous.pid) || previous.pid <= 0) throw denied("恢复锁身份无效");
    let alive = true;
    try {
      process.kill(previous.pid, 0);
    } catch (cause) {
      if (cause.code === "ESRCH") alive = false;
    }
    if (alive || readFileSync(file, "utf8") !== old) throw denied("另一个 DSH 进程正在恢复文件，请稍后再试");
    unlinkSync(file);
    take();
  }
  return () => {
    if (readFileSync(file, "utf8") === content) unlinkSync(file);
  };
}
function validate(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).some((key) => !Object.hasOwn(initial(), key)) || value.version !== 1 || !Number.isSafeInteger(value.revision) || value.revision < 0 || value.reviewRequired !== true || !["inherit", ...Object.keys(rank)].includes(value.sandboxCeiling) || !Array.isArray(value.blockedTools) || value.blockedTools.length > 256 || value.blockedTools.some((name) => typeof name !== "string" || !name || name.length > 160 || !/^[\w.:/-]+\*?$/.test(name)) || !Number.isInteger(value.maxOutputTokens) || value.maxOutputTokens !== 0 && (value.maxOutputTokens < 256 || value.maxOutputTokens > 131072)) throw denied("安全基线配置无效");
  return structuredClone(value);
}
class SafetyPolicy {
  constructor(data, ctx) {
    this.file = path.join(data, "safety-policy.json");
    this.ctx = ctx;
    this.state = initial();
    this.ready = false;
    this.queue = Promise.resolve();
    this.restoring = /* @__PURE__ */ new Map();
    this.activeTools = /* @__PURE__ */ new Set();
    this.nativeResolve = null;
    this.previews = /* @__PURE__ */ new Map();
    this.denials = /* @__PURE__ */ new Map();
    this.loggedDenials = /* @__PURE__ */ new WeakSet();
  }
  async load() {
    await mkdir(path.dirname(this.file), { recursive: true });
    try {
      this.state = validate(JSON.parse(await readFile(this.file, "utf8")));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    this.ready = true;
  }
  view(sessionId) {
    let native = null, error = null;
    try {
      const session = this.ctx.get("sessions")?.get(sessionId);
      if (session) native = this.ctx.get("sandboxPolicy")?.resolve({ session }) ?? null;
    } catch (cause) {
      error = cause.message;
    }
    return { ...structuredClone(this.state), ready: this.ready, sessionId: sessionId ?? null, native, error, scope: "all-modes-and-all-sessions", capabilities: { fileSandbox: this.ctx.get("fs")?.sandboxMode ?? null, commandSandbox: this.ctx.get("shell")?.sandboxMode ?? null } };
  }
  configure(value, revision) {
    const job = this.queue.then(async () => {
      if (!this.ready || revision !== this.state.revision) throw denied("安全配置已变化，请刷新");
      const next = validate({ ...value, version: 1, revision: revision + 1 });
      const temp = this.file + "." + randomUUID() + ".tmp";
      await writeFile(temp, JSON.stringify(next, null, 2), { mode: 384, flag: "wx" });
      await rename(temp, this.file);
      this.state = next;
      return this.view();
    });
    this.queue = job.catch(() => {
    });
    return job;
  }
  ancestry(session) {
    const result = [], seen = /* @__PURE__ */ new Set();
    let current = session;
    while (current) {
      if (seen.has(current.id) || result.length >= 32) throw denied("会话权限继承链循环或过深");
      seen.add(current.id);
      result.push(current);
      const parent = current.header?.parentSession;
      if (!parent) break;
      current = this.ctx.get("sessions")?.get(parent);
      if (!current) throw denied("父会话权限尚未加载，子智能体操作已暂停");
    }
    return result;
  }
  resolve(original, request = {}) {
    if (!this.ready) throw denied("安全基线尚未就绪");
    const chain = request.session ? this.ancestry(request.session) : [], policies = chain.map((session) => original({ session })), selected = original(request);
    let mode = selected.mode;
    if (!Object.hasOwn(rank, mode)) throw denied("宿主返回未知权限等级");
    for (const policy of policies) {
      if (!Object.hasOwn(rank, policy.mode)) throw denied("父会话返回未知权限等级");
      if (rank[policy.mode] < rank[mode]) mode = policy.mode;
    }
    if (this.state.sandboxCeiling !== "inherit" && rank[this.state.sandboxCeiling] < rank[mode]) mode = this.state.sandboxCeiling;
    let roots = [selected.workspaceRoot, ...selected.additionalWritableRoots ?? []];
    for (const policy of policies.slice(1)) {
      const parentRoots = [policy.workspaceRoot, ...policy.additionalWritableRoots ?? []].map(physical);
      roots = roots.filter((root) => parentRoots.some((parent) => within(parent, physical(root))));
    }
    if (mode === "workspace-write" && !roots.includes(selected.workspaceRoot)) throw denied("子智能体工作区超出主会话授权范围");
    return { ...selected, mode, ...mode === "workspace-write" ? { additionalWritableRoots: roots.filter((root) => root !== selected.workspaceRoot) } : { additionalWritableRoots: [] } };
  }
  check(exec) {
    if (!this.ready) throw denied("安全基线尚未就绪");
    const restriction = actionRestriction(exec);
    if (restriction) throw Object.assign(denied(restriction.reason), { code: restriction.code });
    for (const key of ["file_path", "path", "filename", "target_path"]) {
      const value = exec.arguments?.[key];
      if(typeof value==='string'&&guardianPath(physical(path.resolve(exec.agent?.session?.header?.cwd??'.',value))))throw Object.assign(denied('独立审查记录禁止工作智能体访问'),{code:'SAFETY_AUDITOR_ISOLATION'});
      if (typeof value === "string" && credentialPath(physical(path.resolve(exec.agent?.session?.header?.cwd ?? ".", value)))) throw Object.assign(denied("文件目标解析到了受保护的私钥或凭据存储"), { code: "SAFETY_PROTECTED_CREDENTIAL" });
    }
    if (this.state.blockedTools.some((name) => name.endsWith("*") ? exec.name.startsWith(name.slice(0, -1)) : exec.name === name)) throw denied("工具已被全局安全基线禁用 · " + exec.name);
    const agent = exec.agent;
    if (!agent?.session?.id || this.ctx.get("agents")?.get(agent.session.id) !== agent) throw denied("工具调用的会话身份无效");
    if (agent) this.ancestry(agent.session);
    const requested = exec.arguments?.sandbox_permissions;
    if (Object.hasOwn(rank, requested)) {
      if (this.state.sandboxCeiling !== "inherit" && rank[requested] > rank[this.state.sandboxCeiling]) throw Object.assign(denied("本次权限请求超出用户设置的全局文件权限上限"), { code: "SAFETY_PERMISSION_CEILING" });
      if (agent?.session?.header?.origin === "subagent") {
        const standing = this.ctx.get("sandboxPolicy")?.resolve({ session: agent.session });
        if (!standing || rank[requested] > rank[standing.mode]) throw Object.assign(denied("子智能体权限请求超出其继承的主会话权限等级"), { code: "SAFETY_CHILD_PERMISSION_CEILING" });
      }
    }
    const cwd = agent?.session?.header?.cwd;
    if (cwd && [...this.restoring.values()].some((root) => within(root, physical(cwd)) || within(physical(cwd), root))) throw denied("工作区正在恢复检查点，请等待恢复结束");
  }
  denialFor(id) {
    return this.denials.get(id) ?? null;
  }
  async recordDenial(exec, error) {
    if (this.loggedDenials.has(exec)) return;
    this.loggedDenials.add(exec);
    const event = { at: (/* @__PURE__ */ new Date()).toISOString(), sessionId: exec.agent?.session?.id ?? null, tool: exec.name, code: error.code ?? "STRONGER_SAFETY_POLICY", reason: error.message };
    if (event.sessionId) {
      this.denials.delete(event.sessionId);
      this.denials.set(event.sessionId, event);
      while (this.denials.size > 128) this.denials.delete(this.denials.keys().next().value);
    }
    this.onDenied?.(event);
    const write = this.queue.then(async () => {
      const file = path.join(path.dirname(this.file), "safety-audit.jsonl"), info = await lstat(file).catch((cause) => {
        if (cause.code === "ENOENT") return null;
        throw cause;
      });
      if (info && (!info.isFile() || info.nlink > 1)) throw denied("安全审计存储异常");
      if (info?.size > 1024 * 1024) await rename(file, file + ".previous");
      await appendFile(file, JSON.stringify(event) + "\n", { mode: 384 });
    });
    this.queue = write.catch(() => {
    });
    await write;
  }
  async previewFingerprint(agent, seq, files) {
    const hash = createHash("sha256").update(JSON.stringify({ id: agent.session.id, seq, surface: agent.session.surface.nodes, revision: this.state.revision, files }));
    for (const file of files) {
      const info = await lstat(file.path).catch((error) => {
        if (error.code === "ENOENT") return null;
        throw error;
      });
      if (info) {
        if (!info.isFile() || info.nlink > 1) throw denied("预览目标已变为链接或特殊文件");
        hash.update(JSON.stringify([info.dev, info.ino, info.size, info.mtimeMs]));
        for await (const chunk of createReadStream(file.path)) hash.update(chunk);
      } else hash.update("absent");
    }
    return hash.digest("hex");
  }
  async prepareRestore(agent, seq, files) {
    const token = randomUUID(), fingerprint = await this.previewFingerprint(agent, seq, files);
    this.previews.set(token, { sessionId: agent.session.id, seq, fingerprint, expires: Date.now() + 3e5 });
    while (this.previews.size > 128) this.previews.delete(this.previews.keys().next().value);
    return token;
  }
  async confirmRestore(agent, seq, files, token) {
    const preview = this.previews.get(token);
    if (!preview || preview.sessionId !== agent.session.id || preview.seq !== seq || preview.expires < Date.now()) throw denied("文件恢复预览已失效，请重新预览并确认");
    if (preview.fingerprint !== await this.previewFingerprint(agent, seq, files)) throw denied("文件、会话或权限在预览后已变化，请重新预览");
    this.previews.delete(token);
  }
  async restorePermit(agent, paths) {
    if (!this.ready) throw denied("安全基线尚未就绪");
    const service = this.ctx.get("sandboxPolicy");
    if (!service) throw denied("宿主文件权限服务不可用，文件恢复未执行");
    const policy = service.resolve({ session: agent.session });
    if (paths.length && policy.mode === "read-only") throw denied("当前权限等级为只读，不能恢复工作区文件");
    const roots = [policy.workspaceRoot, ...policy.additionalWritableRoots ?? []].map(physical);
    if (policy.mode === "workspace-write" && paths.some((file) => !roots.some((root2) => within(root2, physical(file))))) throw denied("恢复目标超出当前会话文件权限");
    const root = physical(agent.session.header.cwd ?? policy.workspaceRoot);
    for (const other of this.ctx.get("agents")?.list?.() ?? []) {
      if (other === agent || other.status === "idle" || !other.session?.header?.cwd) continue;
      const otherRoot = physical(other.session.header.cwd);
      if (within(root, otherRoot) || within(otherRoot, root)) throw denied("同一工作区还有智能体正在工作，请先停止相关任务再恢复文件");
    }
    if ([...this.activeTools].some((exec) => exec.agent !== agent && exec.agent?.session?.header?.cwd && (within(root, physical(exec.agent.session.header.cwd)) || within(physical(exec.agent.session.header.cwd), root)))) throw denied("工作区仍有工具执行中，请稍后恢复");
    if ([...this.restoring.values()].some((other) => within(root, other) || within(other, root))) throw denied("工作区已有恢复操作，请等待完成");
    const release = restoreLease(path.join(path.dirname(this.file), "rewind-restore.lock"));
    const key = randomUUID();
    this.restoring.set(key, root);
    return () => {
      this.restoring.delete(key);
      release();
    };
  }
}
function wireSafety(ctx, safety) {
  ctx.inject(["sandboxPolicy"], (scope) => scope.effect(() => {
    const service = scope.get("sandboxPolicy"), previous = service.resolve;
    let active = true;
    const resolve = function(request) {
      return active ? safety.resolve(previous.bind(this), request) : previous.call(this, request);
    };
    service.resolve = resolve;
    safety.nativeResolve = resolve;
    return () => {
      active = false;
      if (service.resolve === resolve) service.resolve = previous;
      if (safety.nativeResolve === resolve) safety.nativeResolve = null;
    };
  }, "ui-stronger: inherited sandbox policy"));
  ctx.inject(["llm"], (scope) => scope.effect(() => {
    const service = scope.get("llm"), previousStream = service.stream, previousPrepare = service.prepareCall;
    let active = true;
    const cap = (value) => {
      const limit = active ? safety.state.maxOutputTokens : 0;
      return limit ? { ...value, maxTokens: Math.min(value.maxTokens ?? limit, limit) } : value;
    };
    const stream = function(options) {
      return previousStream.call(this, cap(options));
    };
    const prepare = typeof previousPrepare === "function" ? function(config, signal, configure) {
      return previousPrepare.call(this, cap(config), signal, (controls, info) => cap(configure ? configure(controls, info) : controls));
    } : null;
    service.stream = stream;
    if (prepare) service.prepareCall = prepare;
    return () => {
      active = false;
      if (service.stream === stream) service.stream = previousStream;
      if (prepare && service.prepareCall === prepare) service.prepareCall = previousPrepare;
    };
  }, "ui-stronger: model output budget"));
  ctx.on("llm/stream", (options, next) => (async function* () {
    if (!safety.ready) throw denied("安全基线尚未就绪");
    const limit = safety.state.maxOutputTokens;
    if (limit && (!Number.isSafeInteger(options.maxTokens) || options.maxTokens > limit)) throw denied("模型输出预算超过当前安全上限，请重新发起请求以应用新设置");
    yield* next();
  })(), { global: true });
  ctx.inject(["tools"], (scope) => {
    scope.tools.guard((exec) => {
      try {
        safety.check(exec);
      } catch (error) {
        void safety.recordDenial(exec, error).catch(() => {
        });
        return error.message;
      }
    });
    scope.on("tools/pre-execute", async (exec, next) => {
      try {
        safety.check(exec);
      } catch (error) {
        try {
          await safety.recordDenial(exec, error);
        } catch {
          error = denied("安全策略拒绝且审计写入失败，操作未执行");
        }
        return { kind: "deny", reason: error.message, info: { code: error.code, name: "SafetyPolicyDenied", reason: error.message } };
      }
      return next();
    }, { global: true, prepend: true });
    scope.on("tools/execute", async (exec, next) => {
      safety.check(exec);
      safety.activeTools.add(exec);
      try {
        return await next();
      } finally {
        safety.activeTools.delete(exec);
      }
    }, { global: true });
  });
  ctx.effect(() => () => safety.queue);
}
export {
  SafetyPolicy,
  wireSafety,
  within
};
