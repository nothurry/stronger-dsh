import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const vendor = path.join(root, "vendor/rewind/src");
await build({ entryPoints: [path.join(vendor, "index.ts")], outfile: path.join(root, "lib/rewind.js"), bundle: true,
  absWorkingDir: root, format: "esm", platform: "node", target: "es2024", external: ["@deepseek-ai/*"], legalComments: "inline", banner: { js: "/* MIT code adapted from SiriLee/dsh-rewind. See THIRD_PARTY_NOTICES.md. */" } });
const client = await build({ entryPoints: [path.join(vendor, "client/index.ts")], bundle: true,
  absWorkingDir: root, format: "cjs", platform: "browser", target: "es2020", write: false, external: ["react", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"], jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment", define: { __DSH_REWIND_VERSION__: JSON.stringify("0.19.42"), __DSH_REWIND_BUILD__: JSON.stringify("536d7881-adapted") } });
const file = path.join(root, "lib/client.js");
let source = await readFile(file, "utf8");
const start = " /* BEGIN REWIND BUNDLE */", end = " /* END REWIND BUNDLE */";
if (source.includes(start)) source = source.slice(0, source.indexOf(start)).replace(/\s+$/, "\n") + source.slice(source.indexOf(end) + end.length).replace(/^\s+/, " ");
const bundle = start + '\n function createRewindClient(){var React=require("react");var module={exports:{}};var exports=module.exports;\n' + client.outputFiles[0].text + "\nreturn module.exports;}\n" + end;
source = source.replace(" const React=require('react')", bundle + "\n const React=require('react')");
source = source.replace(" /* INSTALL REWIND CLIENT */", "");
source = source.replace("ctx.inject(rewindClient.inject,scope=>rewindClient.apply(scope));", "ctx.inject(['slots','sessions','locale','commandUi','configForms'],scope=>createRewindClient().apply(scope));");
if (!source.includes("createRewindClient().apply(scope)")) source = source.replace(" function apply(ctx){", " function apply(ctx){\n ctx.inject(['slots','sessions','locale','commandUi','configForms'],scope=>createRewindClient().apply(scope));");
await writeFile(file, source);
