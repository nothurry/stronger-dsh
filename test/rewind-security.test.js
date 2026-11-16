import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, link, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Context } from "@deepseek-ai/cordis";
import { Session } from "@deepseek-ai/dsh-session";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import { apply as installRewind, Config, SnapshotStore, listRewindCandidates, planRewind } from "../lib/rewind.js";
import { SafetyPolicy, wireSafety } from "../lib/safety.js";
import { ModelAccess, wireModelAccess } from "../lib/model-access.js";
async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), "stronger-rewind-"));
  const cwd = path.join(root, "workspace");
  await mkdir(cwd);
  const sessions = /* @__PURE__ */ new Map(), agents = /* @__PURE__ */ new Map();
  const ctx = { get: (name) => ({ sessions, agents: { get: (id) => agents.get(id), list: () => [...agents.values()] }, sandboxPolicy: { resolve: ({ session }) => ({ mode: "workspace-write", workspaceRoot: session.header.cwd }) } })[name] };
  const safety = new SafetyPolicy(path.join(root, "data"), ctx);
  await safety.load();
  const store = new SnapshotStore(path.join(root, "snapshots"));
  return { root, cwd, sessions, agents, ctx, safety, store, close: () => rm(root, { recursive: true, force: true }) };
}
async function recorded(store, id, file, original = "before") {
  await writeFile(file, original);
  await store.loadSession({ id, version: 4, messageIds: ["m1", "m2"] });
  await store.createCheckpoints(id, 4, ["m1"]);
  await store.captureFirstTouch(id, file);
  await writeFile(file, "after");
  await store.createCheckpoints(id, 4, ["m2"]);
}
test("independent parent and child checkpoints restore their own pre-edit bytes across restart", async () => {
  const f = await fixture();
  try {
    const main = path.join(f.cwd, "main.txt"), child = path.join(f.cwd, "child.txt");
    await recorded(f.store, "parent", main, "main-before");
    await recorded(f.store, "child", child, "child-before");
    const reloaded = new SnapshotStore(path.join(f.root, "snapshots"));
    await reloaded.loadSession({ id: "child", version: 4, messageIds: ["m1", "m2"] });
    const preview = await reloaded.preview("child", "m1");
    assert.deepEqual(preview.files, [{ path: child, action: "restore" }]);
    const result = await reloaded.restoreAfter("child", "m1");
    assert.deepEqual(result.restored, [child]);
    assert.equal(await readFile(child, "utf8"), "child-before");
    assert.equal(await readFile(main, "utf8"), "after");
    assert.equal((await reloaded.restoreAfter("child", "m1")).restored.length, 0);
  } finally {
    await f.close();
  }
});
test("rewind removes only a tracked newly created file and preserves unrelated files", async () => {
  const f = await fixture();
  try {
    const fresh = path.join(f.cwd, "new.txt"), unrelated = path.join(f.cwd, "human.txt");
    await f.store.loadSession({ id: "s", version: 4, messageIds: ["m"] });
    await f.store.createCheckpoints("s", 4, ["m"]);
    await f.store.captureFirstTouch("s", fresh);
    await writeFile(fresh, "new");
    await writeFile(unrelated, "human");
    assert.deepEqual((await f.store.restoreAfter("s", "m")).deleted, [fresh]);
    assert.equal(await readFile(unrelated, "utf8"), "human");
  } finally {
    await f.close();
  }
});
test("same-sized backup corruption fails integrity checks without changing live content", async () => {
  const f = await fixture();
  try {
    const file = path.join(f.cwd, "file.txt");
    await recorded(f.store, "s", file, "before");
    const directory = path.join(f.store.sessionDir("s"), "versions");
    for (const name of await readdir(directory)) {
      const data = await readFile(path.join(directory, name));
      await writeFile(path.join(directory, name), Buffer.alloc(data.length, 88));
    }
    const result = await f.store.restoreAfter("s", "m1");
    assert.equal(result.restored.length, 0);
    assert(result.failed.some((row) => /integrity/.test(row.message)));
    assert.equal(await readFile(file, "utf8"), "after");
  } finally {
    await f.close();
  }
});
test("a concurrent human edit immediately before commit is retained and reported", async () => {
  const f = await fixture();
  try {
    const file = path.join(f.cwd, "file.txt");
    await recorded(f.store, "s", file);
    const store = new SnapshotStore(path.join(f.root, "snapshots"), { testHooks: { beforeRestoreRename: () => writeFile(file, "human-new") } });
    await store.loadSession({ id: "s", version: 4, messageIds: ["m1", "m2"] });
    const result = await store.restoreAfter("s", "m1");
    assert.equal(result.restored.length, 0);
    assert.match(result.failed[0].message, /changed/);
    assert.equal(await readFile(file, "utf8"), "human-new");
  } finally {
    await f.close();
  }
});
test("hard-linked and junction-swapped restore targets remain untouched", async () => {
  const f = await fixture();
  try {
    const file = path.join(f.cwd, "file.txt"), alias = path.join(f.cwd, "alias.txt");
    await recorded(f.store, "s", file);
    await link(file, alias);
    const result = await f.store.restoreAfter("s", "m1");
    assert.equal(result.restored.length, 0);
    assert.equal(await readFile(alias, "utf8"), "after");
    assert(result.skipped.some((row) => row.reason === "unsafe"));
    await rm(alias);
    await rm(file);
    await mkdir(alias);
    await writeFile(path.join(alias, "human"), "unrelated");
    await symlink(alias, file, "junction");
    const linked = await f.store.restoreAfter("s", "m1");
    assert.equal(linked.restored.length, 0);
    assert.equal(await readFile(path.join(alias, "human"), "utf8"), "unrelated");
  } finally {
    await f.close();
  }
});
test("malicious session identifiers cannot collide or escape the store root", async () => {
  const f = await fixture();
  try {
    const ids = ["..", ".", "../a", "..\\a", "a/b", "a_b", "", "x".repeat(1e3)];
    const dirs = ids.map((id) => f.store.sessionDir(id));
    assert.equal(new Set(dirs).size, ids.length);
    for (const directory of dirs) {
      const relative = path.relative(f.store.root, directory);
      assert(relative !== ".." && !relative.startsWith(".." + path.sep));
      assert(!path.isAbsolute(relative));
    }
  } finally {
    await f.close();
  }
});
test("a symlink planted at a session store directory is rejected", async () => {
  const f = await fixture();
  try {
    const outside = path.join(f.root, "outside");
    await mkdir(outside);
    await mkdir(f.store.root);
    await symlink(outside, f.store.sessionDir("hostile"), "junction");
    await assert.rejects(f.store.loadSession({ id: "hostile", version: 4, messageIds: [] }), /unsafe checkpoint/);
    assert.deepEqual(await readdir(outside), []);
  } finally {
    await f.close();
  }
});
test("native append-only session rewind excludes withdrawn context while preserving raw events", () => {
  const session = Session.create("s");
  session.header = { ...session.header };
  const first = createUserMessage({ content: [{ type: "text", text: "first" }], source: { kind: "user" } });
  const second = createUserMessage({ content: [{ type: "text", text: "second" }], source: { kind: "user" } });
  session.append("user/message", first, { surfaceOp: "append" });
  session.append("user/message", second, { surfaceOp: "append" });
  const before = session.snapshotEvents();
  const seq = before.at(-1).seq;
  const plan = planRewind(before, session.surface.nodes, { kind: "seq", seq });
  session.append("user/message", createUserMessage({ content: [{ type: "text", text: "(empty message)" }], source: { kind: "ui-stronger-rewind" } }), { surfaceOp: { op: "replace", startSeq: plan.surfaceStart, endSeq: plan.surfaceEnd }, sourceEventSeqs: plan.shadowedSeqs });
  assert.equal(session.snapshotEvents().length, before.length + 1);
  assert(session.snapshotEvents().some((row) => row.seq === seq));
  assert(!session.surface.nodes.includes(seq));
  assert.equal(listRewindCandidates(session.snapshotEvents(), session.surface.nodes).length, 1);
  assert.throws(() => planRewind(session.snapshotEvents(), session.surface.nodes, { kind: "seq", seq }), /surface|context/);
});
test("all modes and child nesting inherit the same effective sandbox ceiling", async () => {
  const f = await fixture();
  try {
    const original = ({ session }) => ({ mode: session?.mode ?? "danger-full-access", workspaceRoot: session?.header.cwd ?? f.cwd });
    for (const mode of ["standard", "ptc", "minimal", "create", "team"]) for (const level of ["read-only", "workspace-write", "danger-full-access"]) {
      const parent = { id: "parent", mode: level, header: { cwd: f.cwd, preset: mode } }, child = { id: "child", mode: "danger-full-access", header: { cwd: f.cwd, origin: "subagent", parentSession: "parent" } };
      f.sessions.set("parent", parent);
      f.sessions.set("child", child);
      const value = f.safety.resolve(original, { session: child });
      assert.equal(value.mode, level, mode + " " + level);
    }
    const grandchild = { id: "grandchild", mode: "danger-full-access", header: { cwd: f.cwd, origin: "subagent", parentSession: "child" } };
    f.sessions.get("parent").mode = "read-only";
    assert.equal(f.safety.resolve(original, { session: grandchild }).mode, "read-only");
  } finally {
    await f.close();
  }
});
test("missing and cyclic parent authority fails closed with a concrete reason", async () => {
  const f = await fixture();
  try {
    const child = { id: "child", header: { cwd: f.cwd, parentSession: "missing" } };
    assert.throws(() => f.safety.ancestry(child), /父会话权限/);
    f.sessions.set("missing", { id: "missing", header: { parentSession: "child" } });
    f.sessions.set("child", child);
    assert.throws(() => f.safety.ancestry(child), /循环/);
  } finally {
    await f.close();
  }
});
test("child workspace and extra roots cannot widen the parent writable boundary", async () => {
  const f = await fixture();
  try {
    const outside = path.join(f.root, "outside");
    await mkdir(outside);
    const parent = { id: "p", header: { cwd: f.cwd } }, child = { id: "c", header: { cwd: outside, parentSession: "p" } };
    f.sessions.set("p", parent);
    const original = ({ session }) => ({ mode: "workspace-write", workspaceRoot: session.header.cwd, additionalWritableRoots: session === child ? [outside] : [] });
    assert.throws(() => f.safety.resolve(original, { session: child }), /授权范围/);
    child.header.cwd = f.cwd;
    assert.deepEqual(f.safety.resolve(original, { session: child }).additionalWritableRoots, []);
  } finally {
    await f.close();
  }
});
test("file restore honors selected native permission grade and overlapping active agents", async () => {
  const f = await fixture();
  try {
    const session = { id: "s", header: { cwd: f.cwd } }, agent = { session, status: "idle" };
    f.sessions.set("s", session);
    f.agents.set("s", agent);
    await assert.rejects(f.safety.restorePermit(agent, [path.join(f.root, "outside")]), /超出/);
    const other = { session: { id: "other", header: { cwd: f.cwd } }, status: "running" };
    f.agents.set("other", other);
    await assert.rejects(f.safety.restorePermit(agent, [path.join(f.cwd, "file")]), /还有智能体/);
    other.status = "idle";
    const release = await f.safety.restorePermit(agent, [path.join(f.cwd, "file")]);
    assert.throws(() => f.safety.check({ agent: other, name: "write" }), /恢复检查点/);
    release();
    f.ctx.get("sandboxPolicy").resolve = () => ({ mode: "read-only", workspaceRoot: f.cwd });
    const readonly = new SafetyPolicy(path.join(f.root, "readonly"), { get: (key) => key === "sandboxPolicy" ? { resolve: () => ({ mode: "read-only", workspaceRoot: f.cwd }) } : f.ctx.get(key) });
    await readonly.load();
    await assert.rejects(readonly.restorePermit(agent, [path.join(f.cwd, "file")]), /只读/);
  } finally {
    await f.close();
  }
});
test("tool disable and output limits apply to every model stream and nested tool identity", async () => {
  const f = await fixture();
  try {
    const hooks = {}, guards = [];
    const ctx = { get: f.ctx.get, inject: (keys, fn) => {
      if (keys.includes("tools")) fn({ tools: { guard: (fn2) => guards.push(fn2) }, on: (name, fn2) => hooks[name] = fn2 });
    }, on: (name, fn) => hooks[name] = fn, effect() {
    } };
    wireSafety(ctx, f.safety);
    await f.safety.configure({ ...f.safety.state, blockedTools: ["mcp__danger*"], maxOutputTokens: 1024 }, 0);
    for (const origin of ["user", "subagent"]) {
      const agent = { session: { id: origin, header: { cwd: f.cwd, origin } } };
      f.sessions.set(origin, agent.session);
      f.agents.set(origin, agent);
      const exec = { agent, name: "mcp__danger__delete", parent: {} };
      assert.match(guards[0](exec), /全局安全基线禁用/);
      const result = await hooks["tools/pre-execute"](exec, () => assert.fail("must not execute"));
      assert.equal(result.kind, "deny");
    }
    const options = { provider: "test", model: "test", maxTokens: 1024 };
    let seen;
    for await (const _ of hooks["llm/stream"](options, async function* () {
      seen = options.maxTokens;
      yield { type: "finish" };
    })) {
    }
    assert.equal(seen, 1024);
    await assert.rejects(f.safety.configure({ ...f.safety.state }, 0), /已变化/);
  } finally {
    await f.close();
  }
});
test("output ceilings are applied before prepared-call registration and preserve frozen inputs", async () => {
  const f = await fixture();
  try {
    await f.safety.configure({ ...f.safety.state, maxOutputTokens: 1024 }, 0);
    let direct, prepared, dispose;
    const service = { stream: (options) => {
      direct = options;
      return [];
    }, prepareCall: async (config, _signal, configure) => {
      prepared = configure(config, { defaultMaxTokens: 8192 });
      return { config: prepared };
    } };
    wireSafety({ get: f.ctx.get, inject: (keys, fn) => {
      if (keys.includes("llm")) fn({ get: () => service, effect: (fn2) => dispose = fn2() });
    }, on() {
    }, effect() {
    } }, f.safety);
    const original = Object.freeze({ provider: "p", model: "m", maxTokens: 8192 });
    service.stream(original);
    assert.equal(direct.maxTokens, 1024);
    assert.equal(original.maxTokens, 8192);
    const call = await service.prepareCall(original, void 0, (controls) => ({ ...controls, maxTokens: 4e3 }));
    assert.equal(call.config.maxTokens, 1024);
    dispose();
    service.stream(original);
    assert.equal(direct.maxTokens, 8192);
  } finally {
    await f.close();
  }
});
test("child escalations and explicit global ceilings cannot be widened by tool arguments", async () => {
  const f = await fixture();
  try {
    const parent = { id: "p", header: { cwd: f.cwd } }, session = { id: "c", header: { cwd: f.cwd, origin: "subagent", parentSession: "p" } }, agent = { session };
    f.sessions.set("p", parent);
    f.sessions.set("c", session);
    f.agents.set("c", agent);
    assert.throws(() => f.safety.check({ agent, name: "bash", arguments: { command: "Get-Date", sandbox_permissions: "danger-full-access" } }), (error) => error.code === "SAFETY_CHILD_PERMISSION_CEILING");
    await f.safety.configure({ ...f.safety.state, sandboxCeiling: "read-only" }, 0);
    assert.throws(() => f.safety.check({ agent, name: "bash", arguments: { command: "Get-Date", sandbox_permissions: "workspace-write" } }), (error) => error.code === "SAFETY_PERMISSION_CEILING");
  } finally {
    await f.close();
  }
});
test("global model bans cover children, reviewers, summaries and ordinary calls without adapter dispatch", async () => {
  const f = await fixture();
  try {
    const access = new ModelAccess(path.join(f.root, "models"));
    await access.load();
    await access.set({ provider: "disabled", enabled: false });
    let stream;
    wireModelAccess({ on: (_name, fn) => stream = fn, effect() {
    } }, access);
    for (const kind of ["main", "child", "review", "summary", "ocr"]) await assert.rejects(async () => {
      for await (const _ of stream({ provider: "disabled", model: "m", sessionId: kind }, () => assert.fail("adapter invoked"))) {
      }
    }, /停用/);
  } finally {
    await f.close();
  }
});
test("sandbox resolver composition restores only its own wrapper on unload", async () => {
  const f = await fixture();
  try {
    const service = { resolve: ({ session }) => ({ mode: "workspace-write", workspaceRoot: session.header.cwd }) }, original = service.resolve;
    let dispose;
    wireSafety({ get: f.ctx.get, inject: (keys, fn) => {
      if (keys.includes("sandboxPolicy")) fn({ get: () => service, effect: (fn2) => dispose = fn2() });
    }, on() {
    }, effect() {
    } }, f.safety);
    assert.notEqual(service.resolve, original);
    const captured = service.resolve, later = function(...args) {
      return captured.apply(this, args);
    };
    service.resolve = later;
    dispose();
    assert.equal(service.resolve, later);
  } finally {
    await f.close();
  }
});
test("restore previews are bound to a session, target, current contents and one confirmation", async () => {
  const f = await fixture();
  try {
    const file = path.join(f.cwd, "file.txt");
    await writeFile(file, "before");
    const agent = { session: { id: "s", header: { cwd: f.cwd }, surface: { nodes: [1, 2] } } }, files = [{ path: file, action: "restore" }];
    const token = await f.safety.prepareRestore(agent, 1, files);
    await assert.rejects(f.safety.confirmRestore(agent, 2, files, token), /失效/);
    await writeFile(file, "human");
    await assert.rejects(f.safety.confirmRestore(agent, 1, files, token), /变化/);
    const fresh = await f.safety.prepareRestore(agent, 1, files);
    await f.safety.confirmRestore(agent, 1, files, fresh);
    await assert.rejects(f.safety.confirmRestore(agent, 1, files, fresh), /失效/);
  } finally {
    await f.close();
  }
});
test("separate plugin instances serialize file restoration with an exclusive lease", async () => {
  const f = await fixture();
  try {
    const agent = { session: { id: "s", header: { cwd: f.cwd } }, status: "idle" };
    f.agents.set("s", agent);
    f.sessions.set("s", agent.session);
    const second = new SafetyPolicy(path.join(f.root, "data"), f.ctx);
    await second.load();
    const release = await f.safety.restorePermit(agent, []);
    await assert.rejects(second.restorePermit(agent, []), /另一个 DSH 进程/);
    release();
    const next = await second.restorePermit(agent, []);
    next();
  } finally {
    await f.close();
  }
});
test("checkpoint retention, disabled gaps, oversize coverage and dry-run cleanup preserve user files", async () => {
  const f = await fixture();
  try {
    const store = new SnapshotStore(path.join(f.root, "bounded"), { maxFileBytes: 32 });
    const ids = Array.from({ length: 105 }, (_, index) => "m" + index), file = path.join(f.cwd, "file.txt");
    await store.loadSession({ id: "s", version: 4, messageIds: ids });
    await store.createCheckpoints("s", 4, [ids[0]]);
    await writeFile(file, "small");
    await store.captureFirstTouch("s", file);
    for (const id of ids.slice(1)) await store.createCheckpoints("s", 4, [id]);
    assert.equal((await readdir(path.join(store.sessionDir("s"), "checkpoints"))).filter((name) => name.endsWith(".json")).length, 100);
    assert((await store.restoreAfter("s", ids[0])).noCheckpoint);
    await writeFile(file, "x".repeat(40));
    const result = await store.restoreAfter("s", ids[10]);
    assert(result.skipped.some((row) => row.reason === "oversized"));
    assert.equal((await readFile(file)).length, 40);
    await store.abandonCurrent("s");
    const fresh = path.join(f.cwd, "fresh.txt");
    await store.captureFirstTouch("s", fresh);
    await writeFile(fresh, "untracked");
    assert.equal((await store.preview("s", ids[10])).files.some((row) => row.path === fresh), false);
    await store.pruneStale({ maxAgeDays: 1, dryRun: true, keepActiveId: "s" });
    assert.equal(await readFile(fresh, "utf8"), "untracked");
    assert.equal((await readFile(file)).length, 40);
  } finally {
    await f.close();
  }
});
test("real Cordis event pipeline captures and rewinds a subagent session including apply_patch first touches", async () => {
  const f = await fixture(), ctx = new Context(), commands = /* @__PURE__ */ new Map();
  try {
    const header = Session.create("template").header;
    const session = Session.create("child-pipeline", [], { ...header, id: "child-pipeline", origin: "subagent", parentSession: "parent-pipeline", cwd: f.cwd });
    const parent = Session.create("parent-pipeline", [], { ...header, id: "parent-pipeline", cwd: f.cwd });
    f.sessions.set(parent.id, parent);
    f.sessions.set(session.id, session);
    const agent = { id: session.id, session, status: "idle", inbox: { nextStep: [], remove() {
    } }, cancel() {
    }, whenIdle: async () => {
    } };
    f.agents.set(session.id, agent);
    ctx.provide("commands", { register: (definition) => {
      commands.set(definition.name, definition);
      return () => commands.delete(definition.name);
    } });
    ctx.provide("settings", { configure: () => () => {
    }, describe: () => [] });
    ctx.provide("tools", {});
    ctx.provide("fs", { resolve: async (file2, { cwd } = {}) => ({ displayPath: path.resolve(cwd ?? f.cwd, file2) }), processPathFromHostPath: (file2) => file2, stat: async () => ({ version: "v" }) });
    ctx.provide("workingDirectory", { ensure: async () => f.cwd });
    ctx.provide("agents", { get: (id) => f.agents.get(id) });
    const config = Config({ snapshotDir: path.join(f.root, "pipeline"), dshHome: f.root });
    installRewind(ctx, config, f.safety);
    await new Promise((resolve) => setImmediate(resolve));
    const prompt = createUserMessage({ source: { kind: "user" }, content: [{ type: "text", text: "edit a file" }] });
    await ctx.waterfall("agent/pre-step", { agent, messages: [prompt] }, async () => ({ kind: "enter", messages: [prompt] }));
    const target = session.append("user/message", prompt, { surfaceOp: "append" });
    const file = path.join(f.cwd, "patch.txt");
    await writeFile(file, "before");
    await ctx.waterfall("tools/execute", { agent, name: "apply_patch", arguments: { patch: "*** Begin Patch\n*** Update File: patch.txt\n@@\n-before\n+after\n*** End Patch" }, signal: new AbortController().signal }, async () => {
      await writeFile(file, "after");
      return { content: [] };
    });
    const result = await commands.get("ui-rewind-engine").handler({ agent, rawInput: "@" + target.seq + " both", signal: new AbortController().signal });
    assert.equal(result.kind, "success");
    assert.equal(await readFile(file, "utf8"), "before");
    assert(!session.surface.nodes.includes(target.seq));
    assert(session.snapshotEvents().some((row) => row.seq === target.seq));
  } finally {
    await ctx.fiber.dispose();
    await f.close();
  }
});
