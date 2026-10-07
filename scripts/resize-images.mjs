// Resize downloaded Wix images in-place to reasonable source sizes.
// Astro's <Image /> handles final optimization at build time; this just
// shrinks the committed source so git pushes don't choke on 100+ MB.
//
// Strategy:
//   - Cap max dimension to 2000 px (plenty for hero at 2x retina).
//   - Preserve aspect ratio.
//   - Keep JPG as JPG at quality 85, PNG as PNG.
//   - Skip files already smaller than 2000 px.
//
// Astro already ships sharp as a transitive dep, so no new install.

import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const DIR = "public/images/raw";
const MAX_DIM = 2000;
const JPG_QUALITY = 85;

const files = (await readdir(DIR)).filter(
  (f) => /\.(jpg|jpeg|png)$/i.test(f)
);

let processed = 0;
let skipped = 0;
let bytesBefore = 0;
let bytesAfter = 0;

for (const file of files) {
  const path = join(DIR, file);
  const before = (await stat(path)).size;
  bytesBefore += before;

  const img = sharp(path);
  const meta = await img.metadata();
  const maxCurrent = Math.max(meta.width ?? 0, meta.height ?? 0);

  if (maxCurrent <= MAX_DIM) {
    skipped++;
    bytesAfter += before;
    continue;
  }

  const isJpg = /\.(jpg|jpeg)$/i.test(file);
  const buffer = await img
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
    .toFormat(isJpg ? "jpeg" : "png", isJpg ? { quality: JPG_QUALITY, mozjpeg: true } : {})
    .toBuffer();

  const { writeFile, rename, unlink } = await import("node:fs/promises");
  const tmp = `${path}.tmp`;
  await writeFile(tmp, buffer);
  await unlink(path);
  await rename(tmp, path);

  const after = (await stat(path)).size;
  bytesAfter += after;
  processed++;
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`Processed: ${processed}`);
console.log(`Skipped (already small): ${skipped}`);
console.log(`Before: ${mb(bytesBefore)} MB`);
console.log(`After:  ${mb(bytesAfter)} MB`);
console.log(`Saved:  ${mb(bytesBefore - bytesAfter)} MB`);
