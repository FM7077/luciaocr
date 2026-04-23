import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";
import { stripRuntimeSourcemaps } from "./strip-runtime-sourcemaps.mjs";

const packageDir = process.cwd();
const repoRoot = resolve(packageDir, "..", "..");
const outDir = resolve(packageDir, "dist");
const webPackageDir = resolve(repoRoot, "packages", "sdk-web");
const webRuntimeDir = resolve(webPackageDir, "src", "runtime");

await rm(outDir, { force: true, recursive: true });
await mkdir(outDir, { recursive: true });

await build({
  entryPoints: [resolve(packageDir, "src/index.js")],
  outfile: resolve(outDir, "index.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  sourcemap: true,
  target: "es2020",
  external: ["vue"],
  logLevel: "info",
});

await cp(
  resolve(packageDir, "src/index.d.ts"),
  resolve(outDir, "index.d.ts")
);
await cp(webRuntimeDir, resolve(outDir, "runtime"), {
  recursive: true,
});
await stripRuntimeSourcemaps(resolve(outDir, "runtime"));
