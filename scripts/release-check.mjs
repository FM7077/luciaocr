import { execFileSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

for (const task of ["build", "typecheck", "test"]) {
  execFileSync(npmCommand, ["run", task], {
    stdio: "inherit",
  });
}
