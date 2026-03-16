#!/usr/bin/env node
/**
 * Populates `export const publishDate = "YYYY-MM-DD"` in any artifact that
 * is missing one, using the date of the file's first git commit.
 *
 * Usage: node scripts/migrate-dates.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const artifactsDir = 'src/artifacts';
const files = readdirSync(artifactsDir)
  .filter(f => f.endsWith('.tsx') && f !== 'index.tsx');

for (const file of files) {
  const filePath = join(artifactsDir, file);
  const content = readFileSync(filePath, 'utf8');

  if (content.includes('export const publishDate')) {
    console.log(`  skip  ${file} (already has publishDate)`);
    continue;
  }

  let date;
  try {
    date = execSync(
      `git log --follow --format="%as" -- "${filePath}" | tail -1`,
      { encoding: 'utf8' }
    ).trim();
  } catch {
    date = '';
  }

  if (!date) {
    console.log(`  skip  ${file} (no git history)`);
    continue;
  }

  // Insert publishDate on the line immediately after artifactStatus
  const updated = content.replace(
    /^(export const artifactStatus = .+;)$/m,
    `$1\nexport const publishDate = "${date}";`
  );

  if (updated === content) {
    console.log(`  skip  ${file} (couldn't find artifactStatus line)`);
    continue;
  }

  writeFileSync(filePath, updated);
  console.log(`  added ${file}  →  ${date}`);
}
