import { readFileSync } from "node:fs";

const html = readFileSync("docs/index.html", "utf8");

if (!html.includes('id="root"')) {
  throw new Error("docs/index.html does not contain the React root");
}

if (!html.includes("/numen/assets/")) {
  throw new Error("docs/index.html does not reference /numen/ assets");
}
