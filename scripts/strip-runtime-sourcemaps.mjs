import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const SOURCE_MAP_COMMENT =
  /(?:\r?\n)?\/\/# sourceMappingURL=[^\r\n]*\.map\s*$/;

export async function stripRuntimeSourcemaps(runtimeDir) {
  const ortPath = resolve(runtimeDir, "ort.min.js");
  const source = await readFile(ortPath, "utf8");
  const nextSource = source.replace(SOURCE_MAP_COMMENT, "");

  if (nextSource !== source) {
    await writeFile(ortPath, nextSource);
  }
}
