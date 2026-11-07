const { execSync } = require("node:child_process");

if (process.env.RENDER !== "true") {
  process.exit(0);
}

execSync("npx next build --webpack", { stdio: "inherit" });
