import fs from 'fs/promises';
import path from 'path';

function incPatch(version) {
  const parts = version.split('.').map(Number);
  while (parts.length < 3) parts.push(0);
  parts[2] = (parts[2] || 0) + 1;
  return parts.join('.');
}

async function bump(remote) {
  const pkgPath = path.resolve('remotes', remote, 'package.json');
  const json = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
  const oldVersion = json.version || '0.0.0';
  const newVersion = incPatch(oldVersion);
  json.version = newVersion;
  await fs.writeFile(pkgPath, JSON.stringify(json, null, 2) + '\n');
  console.log(`${remote} version bumped from ${oldVersion} to ${newVersion}`);
}

const names = process.env.REMOTE_NAMES
  ? process.env.REMOTE_NAMES.split(/[\s,]+/).filter(Boolean)
  : [];

if (names.length === 0) {
  console.log('No remotes provided for version bump');
  process.exit(0);
}

Promise.all(names.map(bump)).catch(err => {
  console.error('Failed to bump versions:', err);
  process.exit(1);
});
