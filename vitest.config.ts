import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["src/test/setup.ts"],
    coverage: {
      reporter: ["text", "lcov"],
      include: ["src/lib/**/*.{ts,tsx}", "src/features/**/*.{ts,tsx}"],
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify("0.1.0-test"),
    __GIT_COMMIT__: JSON.stringify("test-commit"),
    __BUILD_TIME__: JSON.stringify("2026-01-01T00:00:00.000Z"),
  },
});
