#!/usr/bin/env node
/**
 * Rewrites the SITE_URL placeholders and the social links in one pass, so the
 * values only have to be given once instead of being edited in five files.
 *
 *   node scripts/set-site-config.mjs --url https://sakshigill.vercel.app
 *   node scripts/set-site-config.mjs --github https://github.com/sakshigill
 *   node scripts/set-site-config.mjs --x https://x.com/sakshigill
 *   node scripts/set-site-config.mjs --instagram https://instagram.com/sakshigill
 *   node scripts/set-site-config.mjs --linkedin https://www.linkedin.com/in/sakshigill
 *   node scripts/set-site-config.mjs --url "" --github ""   (clear one)
 *
 * Only files that already exist are touched. .env keeps its real value;
 * .env.example is left with an empty value on purpose, because a committed
 * example file must not claim to know the production domain.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const get = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : (args[i + 1] ?? "");
};

const url = get("url");
const github = get("github");
const x = get("x");
const instagram = get("instagram");
const linkedin = get("linkedin");

if ([url, github, x, instagram, linkedin].every((v) => v === undefined)) {
  console.error("Nothing to do. Pass at least one of --url --github --x --instagram --linkedin");
  process.exit(1);
}

/** Replaces `field: "..."` or `FIELD="..."`, preserving indentation. */
function setField(source, field, value, pattern) {
  const re = new RegExp(`(${pattern}\\s*:\\s*)"[^"]*"`, "g");
  if (!re.test(source)) return { text: source, changed: false };
  return {
    text: source.replace(new RegExp(`(${pattern}\\s*:\\s*)"[^"]*"`, "g"), `$1"${value}"`),
    changed: true,
  };
}

function patch(file, edits) {
  const path = resolve(file);
  if (!existsSync(path)) {
    console.log(`  skipped ${file} (not found)`);
    return 0;
  }
  let text = readFileSync(path, "utf8");
  const before = text;
  for (const [pattern, value] of edits) {
    text = setField(text, pattern, value, pattern).text;
  }
  if (text === before) {
    console.log(`  no change ${file}`);
    return 0;
  }
  writeFileSync(path, text, "utf8");
  console.log(`  updated ${file}`);
  return 1;
}

console.log("Setting site configuration:");

// .env drives the build (canonical, OG, sitemap, robots).
if (url !== undefined) patch(".env", [["^SITE_URL$", url]]);

// The profile data drives the visible links and the JSON-LD sameAs list.
const profileEdits = [
  ["^\\s*github$", github],
  ["^\\s*x$", x],
  ["^\\s*instagram$", instagram],
  ["^\\s*linkedin$", linkedin],
].filter(([, value]) => value !== undefined);
if (profileEdits.length) patch("src/data/sakshi.ts", profileEdits);

// Supabase Site URL / auth redirect are set in the dashboard, not here.
console.log("\nReminder: Supabase -> Authentication -> URL Configuration");
console.log("  Site URL            = " + (url || "(unchanged)"));
console.log("  Redirect URLs       = " + (url || "(unchanged)") + "/**");
console.log("Then rebuild:  npm run build");