const { execSync } = require("node:child_process");

if (process.env.RENDER !== "true") {
  process.exit(0);
}

execSync("npx next build --webpack", { stdio: "inherit" });
if (process.env.MONGODB_URI) {
  execSync("node scripts/sync-seed-users.cjs", { stdio: "inherit" });
}
