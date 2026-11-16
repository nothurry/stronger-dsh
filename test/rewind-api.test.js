import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Context } from "@deepseek-ai/cordis";
import { Session } from "@deepseek-ai/dsh-session";
import { CommandRuntime } from "@deepseek-ai/dsh-commands";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import { apply, Config } from "../lib/index.js";
test("the complete plugin owner API rewinds a real independent child through native command lifecycle events", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "stronger-owner-rewind-"));
  const previous = process.env.DSH_HOME;
  process.env.DSH_HOME = root;
  const ctx = new Context(), routes = /* @__PURE__ */ new Map(), sessions = /* @__PURE__ */ new Map(), agents = /* @__PURE__ */ new Map();
  try {
    const cwd = path.join(root, "workspace");
    await mkdir(cwd);
    const header = Session.create("template").header;
    const parent = Session.create("parent", [], { ...header, id: "parent", cwd }), child = Session.create("child", [], { ...header, id: "child", cwd, origin: "subagent", parentSession: "parent" });
    sessions.set(parent.id, parent);
    sessions.set(child.id, child);
    for (const session of [parent, child]) agents.set(session.id, { id: session.id, session, status: "idle", inbox: { nextStep: [], remove() {
    } }, cancel() {
    }, whenIdle: async () => {
    } });
    new CommandRuntime(ctx);
    ctx.provide("tools", { register: () => () => {
    }, guard: () => () => {
    }, get: () => null });
    ctx.provide("sessions", sessions);
    ctx.provide("agents", { get: (id) => agents.get(id), list: () => [...agents.values()] });
    ctx.provide("settings", { configure: () => () => {
    }, describe: () => [] });
    ctx.provide("sandboxPolicy", { resolve: ({ session }) => ({ mode: "workspace-write", workspaceRoot: session.header.cwd }) });
    ctx.provide("workingDirectory", { get: (session) => session.header.cwd, ensure: async (agent) => agent.session.header.cwd });
    ctx.provide("fs", { sandboxMode: "workspace-write", resolve: async (file2, options = {}) => ({ displayPath: path.resolve(options.cwd ?? cwd, file2) }), processPathFromHostPath: (file2) => file2, stat: async () => ({ version: "version" }) });
    ctx.provide("connection", { fetch: { register: (route) => {
      routes.set(route.path, route);
      return () => routes.delete(route.path);
    } } });
    apply(ctx, Config({}));
    const call = async (action, payload = {}) => {
      const method = "ui-stronger/" + action;
      const response = await routes.get("/api/" + method).fetch(new Request("http://local.test/api/" + method, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type: "client-request", rpcId: "test-" + action, method, payload }) }));
      return (await response.json()).result;
    };
    await new Promise((resolve) => setImmediate(resolve));
    const status = await call("status");
    assert.equal(status.ok, true);
    const prompt = createUserMessage({ source: { kind: "user", rpcId: "owner" }, content: [{ type: "text", text: "Update this file and verify it." }] });
    await ctx.waterfall("agent/pre-step", { agent: agents.get("child"), messages: [prompt] }, async () => ({ kind: "enter", messages: [prompt] }));
    const target = child.append("user/message", prompt, { surfaceOp: "append" });
    const file = path.join(cwd, "file.txt");
    await writeFile(file, "before");
    await ctx.waterfall("tools/execute", { agent: agents.get("child"), name: "write", arguments: { file_path: file }, signal: new AbortController().signal }, async () => {
      await writeFile(file, "after");
      return { content: [] };
    });
    const candidates = await call("rewindCandidates", { sessionId: "child" });
    assert.equal(candidates.value.candidates[0].seq, target.seq);
    const preview = await call("rewindPreview", { sessionId: "child", seq: target.seq });
    assert.equal(preview.ok, true);
    assert.equal(preview.value.files.length, 1);
    const result = await call("rewind", { sessionId: "child", seq: target.seq, mode: "both", confirmationToken: preview.value.confirmationToken });
    assert.equal(result.ok, true);
    assert.equal(result.value.result.kind, "success");
    assert.equal(result.value.withdrawn.text, "Update this file and verify it.");
    assert.equal(await readFile(file, "utf8"), "before");
    assert(!child.surface.nodes.includes(target.seq));
    assert(child.snapshotEvents().some((event) => event.seq === target.seq));
    assert(child.snapshotEvents().some((event) => event.type === "command/run"));
    assert(child.snapshotEvents().some((event) => event.type === "command/done" && event.data.kind === "success"));
    const parentCandidates = await call("rewindCandidates", { sessionId: "parent" });
    assert.deepEqual(parentCandidates.value.candidates, []);
    const invalid = await call("rewind", { sessionId: "missing", seq: target.seq, mode: "both", confirmationToken: preview.value.confirmationToken });
    assert.equal(invalid.ok, false);
  } finally {
    await ctx.fiber.dispose();
    if (previous === void 0) delete process.env.DSH_HOME;
    else process.env.DSH_HOME = previous;
    await rm(root, { recursive: true, force: true });
  }
});
