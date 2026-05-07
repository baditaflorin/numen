import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf8"),
) as {
  version: string;
};
const buildMeta = JSON.parse(
  readFileSync(resolve(__dirname, "build-meta.json"), "utf8"),
) as {
  commit: string;
  builtAt: string;
};

export default defineConfig({
  base: "/numen/",
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_COMMIT__: JSON.stringify(
      process.env.NUMEN_BUILD_COMMIT ?? buildMeta.commit,
    ),
    __BUILD_TIME__: JSON.stringify(
      process.env.NUMEN_BUILD_TIME ?? buildMeta.builtAt,
    ),
  },
  build: {
    outDir: "docs",
    emptyOutDir: false,
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "@tanstack/react-query", "idb", "zod"],
          export: ["jszip", "pdf-lib"],
        },
      },
    },
  },
});
