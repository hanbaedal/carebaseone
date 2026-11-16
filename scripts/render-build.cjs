const { execSync } = require("node:child_process");

if (process.env.RENDER !== "true") {
  process.exit(0);
}

execSync("npx next build --webpack", { stdio: "inherit" });

if (process.env.MONGODB_URI) {
  try {
    execSync("node scripts/clear-home-footer-text.cjs", { stdio: "inherit" });
  } catch (err) {
    console.warn("[render-build] footer text cleanup skipped:", err?.message ?? err);
  }
}
