import { execFileSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const task = process.argv[2];

const taskToWorkspaces = {
  build: ["@fm7077/luciaocr-core", "@fm7077/luciaocr-r", "@fm7077/demo-web"],
  clean: ["@fm7077/luciaocr-core", "@fm7077/luciaocr-r", "@fm7077/demo-web"],
  lint: ["@fm7077/luciaocr-core", "@fm7077/luciaocr-r", "@fm7077/demo-web"],
  test: ["@fm7077/luciaocr-core", "@fm7077/luciaocr-r"],
  typecheck: ["@fm7077/luciaocr-core", "@fm7077/luciaocr-r"],
};

const workspaces = taskToWorkspaces[task];

if (!workspaces) {
  throw new Error(`Unsupported workspace task: ${task}`);
}

for (const workspace of workspaces) {
  execFileSync(npmCommand, ["run", task, "--workspace", workspace], {
    stdio: "inherit",
  });
}
