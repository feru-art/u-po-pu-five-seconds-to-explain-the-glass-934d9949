import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");
const ENTRY_TEXT =
  "The glass was sitting in my sunbeam, and I do not share warm spots.";

function characterCount(value) {
  return Array.from(value).length;
}

function sentenceMarkCount(value) {
  let count = 0;
  for (const character of value) {
    if (character === "." || character === "!" || character === "?") {
      count += 1;
    }
  }
  return count;
}

function assertEntryGate(value) {
  const length = characterCount(value);
  if (length < 1 || length > 200) {
    throw new Error(`entry length ${length} is outside 1..200`);
  }
  if (value.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (value.includes("\n") || value.includes("\r")) {
    throw new Error("entry must stay on one line");
  }
  if (!value.endsWith(".") || sentenceMarkCount(value) !== 1) {
    throw new Error("entry must be exactly one sentence");
  }
}

function expectedBytes() {
  return Buffer.from(ENTRY_TEXT, "utf8");
}

function verifyWrittenEntry() {
  const written = readFileSync(OUTPUT_FILE);
  const expected = expectedBytes();
  if (!written.equals(expected)) {
    throw new Error("written entry bytes differ from the entry text");
  }
  if (written.length < 1 || written.length > 800) {
    throw new Error("written entry byte length is implausible");
  }
}

function writeEntry() {
  assertEntryGate(ENTRY_TEXT);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, ENTRY_TEXT, "utf8");
  verifyWrittenEntry();
}

writeEntry();
