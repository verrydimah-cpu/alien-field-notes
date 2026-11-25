// Alien Field Notes: The Two Day Earth Review
// Writes one alien tourist's one-line review of Earth to entry.txt
// in the output directory (MAKEFUN_OUTPUT_DIR, or /output).

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY_TEXT =
  "2 stars. Lovely forests, terrible hosts: spent two days signalling from a crop circle and they photographed it, argued online, and never once brought snacks.";

// This program's own directory, so no path ever depends on the caller's cwd.
const programDir = dirname(fileURLToPath(import.meta.url));

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) {
    return isAbsolute(fromEnv) ? fromEnv : resolve(programDir, fromEnv);
  }
  return "/output";
}

function main(): void {
  // The gate accepts 1 to 200 characters; refuse to write anything else.
  if (ENTRY_TEXT.length < 1 || ENTRY_TEXT.length > 200) {
    throw new Error(`entry text is ${ENTRY_TEXT.length} characters, outside 1-200`);
  }

  const outDir = outputDir();
  mkdirSync(outDir, { recursive: true });

  // Clear only the contents of the output directory, entry by entry.
  // The directory itself is never removed: in the grader it is a mounted
  // volume, and removing it would fail with EBUSY.
  for (const name of readdirSync(outDir)) {
    rmSync(join(outDir, name), { recursive: true, force: true });
  }

  writeFileSync(join(outDir, "entry.txt"), ENTRY_TEXT, "utf8");
}

main();
