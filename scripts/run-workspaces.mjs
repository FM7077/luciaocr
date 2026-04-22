import { execFileSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const task = process.argv[2];

const taskToWorkspaces = {
  build: ["@luciaocr/core", "@luciaocr/web", "@luciaocr/react", "@luciaocr/demo-react"],
  clean: ["@luciaocr/core", "@luciaocr/web", "@luciaocr/react", "@luciaocr/demo-react"],
  lint: ["@luciaocr/core", "@luciaocr/web", "@luciaocr/react", "@luciaocr/demo-react"],
  test: ["@luciaocr/core", "@luciaocr/web", "@luciaocr/react"],
  typecheck: ["@luciaocr/core", "@luciaocr/web", "@luciaocr/react"],
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
