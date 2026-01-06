/**
 * Splits the OCR rulebook into manageable chunks for audit comparison.
 * The source file uses \r (CR) line endings and needs special handling.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const SOURCE_PATH = join(
  __dirname,
  "../rules/eclipse-second-dawn-for-the-galaxy-rulebook.txt",
);
const CHUNKS_DIR = join(__dirname, "../rules/chunks");
const CHUNK_SIZE = 8000; // characters per chunk (roughly 2000 tokens)

function main() {
  // Read the source file
  const raw = readFileSync(SOURCE_PATH, "utf-8");

  // Convert \r to \n for proper line handling
  const normalized = raw.replace(/\r/g, "\n");

  // Clean up OCR artifacts: multiple spaces, weird characters
  const cleaned = normalized
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // Remove control chars except \n
    .replace(/[ \t]+/g, " ") // Normalize whitespace
    .replace(/\n{3,}/g, "\n\n"); // Max 2 consecutive newlines

  // Create chunks directory
  if (!existsSync(CHUNKS_DIR)) {
    mkdirSync(CHUNKS_DIR, { recursive: true });
  }

  // Split into chunks, trying to break at paragraph boundaries
  const chunks: string[] = [];
  let remaining = cleaned;
  let chunkNum = 1;

  while (remaining.length > 0) {
    let chunkEnd = CHUNK_SIZE;

    if (remaining.length > CHUNK_SIZE) {
      // Try to break at a paragraph boundary (double newline)
      const paragraphBreak = remaining.lastIndexOf("\n\n", CHUNK_SIZE);
      if (paragraphBreak > CHUNK_SIZE * 0.5) {
        chunkEnd = paragraphBreak + 2;
      } else {
        // Fall back to sentence boundary
        const sentenceBreak = remaining.lastIndexOf(". ", CHUNK_SIZE);
        if (sentenceBreak > CHUNK_SIZE * 0.5) {
          chunkEnd = sentenceBreak + 2;
        }
      }
    } else {
      chunkEnd = remaining.length;
    }

    const chunk = remaining.slice(0, chunkEnd).trim();
    chunks.push(chunk);

    // Write chunk to file
    const filename = `chunk-${String(chunkNum).padStart(2, "0")}.txt`;
    writeFileSync(join(CHUNKS_DIR, filename), chunk, "utf-8");
    console.log(`Created ${filename} (${chunk.length} chars)`);

    remaining = remaining.slice(chunkEnd).trim();
    chunkNum++;
  }

  console.log(`\nTotal: ${chunks.length} chunks created in ${CHUNKS_DIR}`);

  // Create manifest file
  const manifest = {
    sourceFile: SOURCE_PATH,
    totalChunks: chunks.length,
    chunkSize: CHUNK_SIZE,
    chunks: chunks.map((c, i) => ({
      file: `chunk-${String(i + 1).padStart(2, "0")}.txt`,
      chars: c.length,
      preview: c.slice(0, 100).replace(/\n/g, " ") + "...",
    })),
  };

  writeFileSync(
    join(CHUNKS_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log("Created manifest.json");
}

main();
