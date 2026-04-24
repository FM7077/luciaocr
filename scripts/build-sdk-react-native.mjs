import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";
import { stripRuntimeSourcemaps } from "./strip-runtime-sourcemaps.mjs";

const packageDir = process.cwd();
const repoRoot = resolve(packageDir, "..", "..");
const outDir = resolve(packageDir, "dist");
const srcDir = resolve(packageDir, "src");
const webPackageDir = resolve(repoRoot, "packages", "sdk-web");
const webRuntimeDir = resolve(webPackageDir, "src", "runtime");

await rm(outDir, { force: true, recursive: true });
await mkdir(outDir, { recursive: true });

await cp(webRuntimeDir, resolve(outDir, "runtime"), {
  recursive: true,
});
await stripRuntimeSourcemaps(resolve(outDir, "runtime"));
await cp(resolve(srcDir, "engineDocument.js"), resolve(outDir, "engineDocument.js"));
await cp(resolve(srcDir, "runtimeAssets.js"), resolve(outDir, "runtimeAssets.js"));
await cp(resolve(srcDir, "index.d.ts"), resolve(outDir, "index.d.ts"));

await build({
  entryPoints: [resolve(repoRoot, "packages", "sdk-core", "src", "index.js")],
  outfile: resolve(outDir, "vendor-core.js"),
  bundle: true,
  format: "esm",
  platform: "neutral",
  sourcemap: true,
  target: "es2020",
  logLevel: "info",
});

const indexSource = await readFile(resolve(srcDir, "index.js"), "utf8");
const rewrittenSource = indexSource.replace(
  'from "@luciaocr/core";',
  'from "./vendor-core.js";'
);
await writeFile(resolve(outDir, "index.js"), rewrittenSource);
