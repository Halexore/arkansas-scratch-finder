import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const replChromium = "/repl/tools/bin/chromium";
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
  (existsSync(replChromium) ? replChromium : undefined);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    ...devices["iPhone 13"],
    baseURL: "http://127.0.0.1:5000",
    browserName: "chromium",
    viewport: { width: 402, height: 874 },
    isMobile: true,
    deviceScaleFactor: 3,
    hasTouch: true,
    launchOptions: {
      executablePath,
      args: ["--no-sandbox"]
    }
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:5000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
