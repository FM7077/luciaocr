import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";
import { stripRuntimeSourcemaps } from "./strip-runtime-sourcemaps.mjs";

const packageDir = process.cwd();
const outDir = resolve(packageDir, "dist");

await rm(outDir, { force: true, recursive: true });
await mkdir(outDir, { recursive: true });

await build({
  entryPoints: [resolve(packageDir, "src/index.js")],
  outfile: resolve(outDir, "index.js"),
  bundle: true,
  format: "esm",
  platform: "neutral",
  sourcemap: true,
  target: "es2020",
  logLevel: "info",
});

await cp(
  resolve(packageDir, "src/index.d.ts"),
  resolve(outDir, "index.d.ts")
);
await cp(
  resolve(packageDir, "src/asset-manifest.json"),
  resolve(outDir, "asset-manifest.json")
);
await cp(resolve(packageDir, "src/runtime"), resolve(outDir, "runtime"), {
  recursive: true,
});
await stripRuntimeSourcemaps(resolve(outDir, "runtime"));
