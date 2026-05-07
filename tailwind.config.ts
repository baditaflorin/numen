import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./docs/index.html"],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        moss: "#4d7c0f",
        teal: "#006d77",
        coral: "#d95d39",
        marigold: "#a15c00",
        paper: "#fbfcf7",
      },
      borderRadius: {
        panel: "8px",
      },
      boxShadow: {
        line: "0 1px 0 rgba(23,32,27,0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
