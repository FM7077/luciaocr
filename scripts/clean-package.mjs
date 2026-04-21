import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const target = process.argv[2];

if (!target) {
  throw new Error("Missing clean target");
}

await rm(resolve(process.cwd(), target), {
  force: true,
  recursive: true,
});
