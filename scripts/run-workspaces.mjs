import { execFileSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const task = process.argv[2];

const taskToWorkspaces = {
  build: ["@luciaocr/luciaocr-core", "@luciaocr/luciaocr-r", "@luciaocr/demo-web"],
  clean: ["@luciaocr/luciaocr-core", "@luciaocr/luciaocr-r", "@luciaocr/demo-web"],
  lint: ["@luciaocr/luciaocr-core", "@luciaocr/luciaocr-r", "@luciaocr/demo-web"],
  test: ["@luciaocr/luciaocr-core", "@luciaocr/luciaocr-r"],
  typecheck: ["@luciaocr/luciaocr-core", "@luciaocr/luciaocr-r"],
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
