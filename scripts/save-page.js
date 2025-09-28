#!/usr/bin/env node
// Simple CLI to save an HTML page into public/pages/<slug>.html
// Usage: node scripts/save-page.js --slug my-page < exported.html

import fs from "fs";
import path from "path";

const argv = process.argv.slice(2);
let slug = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--slug" && argv[i + 1]) {
    slug = argv[i + 1];
    i++;
  }
}
if (!slug) {
  console.error("Usage: node scripts/save-page.js --slug my-page < page.html");
  process.exit(2);
}

const outDir = path.resolve(process.cwd(), "public", "pages");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${slug}.html`);

// Read stdin
let data = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  if (!data) {
    console.error("No input received");
    process.exit(3);
  }
  fs.writeFileSync(outPath, data, "utf8");
  console.log("Saved", outPath);
});

// If input already ended (piped), force end
process.stdin.resume();
