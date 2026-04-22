import { execFileSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const task = process.argv[2];

const taskToWorkspaces = {
  build: [
    "@luciaocr/core",
    "@luciaocr/web",
    "@luciaocr/react",
    "@luciaocr/vue",
    "@luciaocr/angular",
    "@luciaocr/demo-react",
    "@luciaocr/demo-vue",
    "@luciaocr/demo-angular",
  ],
  clean: [
    "@luciaocr/core",
    "@luciaocr/web",
    "@luciaocr/react",
    "@luciaocr/vue",
    "@luciaocr/angular",
    "@luciaocr/demo-react",
    "@luciaocr/demo-vue",
    "@luciaocr/demo-angular",
  ],
  lint: [
    "@luciaocr/core",
    "@luciaocr/web",
    "@luciaocr/react",
    "@luciaocr/vue",
    "@luciaocr/angular",
    "@luciaocr/demo-react",
    "@luciaocr/demo-vue",
    "@luciaocr/demo-angular",
  ],
  test: ["@luciaocr/core", "@luciaocr/web", "@luciaocr/react"],
  typecheck: [
    "@luciaocr/core",
    "@luciaocr/web",
    "@luciaocr/react",
    "@luciaocr/vue",
    "@luciaocr/angular",
  ],
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
