import { execFileSync } from "node:child_process";

// Install the starter's existing secret-scan hook on Windows as well as Unix.
// Source archives without a Git checkout have no hook to configure.
try {
  execFileSync("git", ["rev-parse", "--git-dir"], { stdio: "ignore" });
} catch {
  console.info("No Git checkout; skipping hook installation.");
  process.exit(0);
}
execFileSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "inherit" });
