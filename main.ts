// One Line, One Chill — entry program.
//
// Writes a single sentence of horror to /output/entry.txt.
// The scare is a one-minute gap: a hospice nurse marks the father
// deceased at 3:12 a.m., and at 3:13 the call button beside his bed
// rings with a voice asking for the narrator by name — in the
// father's own voice, from the speaker beside his body.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The line, exactly as it must land on disk.
const LINE =
  "The hospice nurse marked my father deceased at 3:12 a.m., yet at 3:13 the call button beside his bed rang, and a voice asked for me by name, in my father's voice, from the speaker beside his body.";

const OUTPUT_DIR = "/output";
const OUTPUT_PATH = join(OUTPUT_DIR, "entry.txt");

// Gate the line the same way the sealed scorer does: UTF-8 text,
// 1 to 200 characters, not only whitespace, and exactly one line.
function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`line is ${line.length} characters, must be 1-200`);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("line must not have leading or trailing whitespace");
  }
  // The gate counts characters, but the Size column counts bytes, and
  // bytes are what decides a size tie-break — keep both inside 200.
  if (new TextEncoder().encode(line).length > 200) {
    throw new Error("line is over 200 bytes");
  }
}

function main(): void {
  validate(LINE);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  // No trailing newline: the file is the line and nothing else.
  writeFileSync(OUTPUT_PATH, LINE, "utf8");
  // Read it back and prove the disk copy is byte-identical.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== LINE) {
    throw new Error("verification failed: /output/entry.txt differs from the line");
  }
  console.log(`wrote ${LINE.length} characters to ${OUTPUT_PATH}`);
}

main();
