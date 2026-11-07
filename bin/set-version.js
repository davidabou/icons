const path = require('path');
const fs = require('fs');

/**
 * Set the same version on every published package, so they are always released together:
 *
 *   bun run set-version 0.3.0
 *   bun run set-version          (no argument: re-applies the root version to the other packages)
 */
const ROOT_DIR = path.resolve(__dirname, '..');

const PACKAGES = [
  'package.json',
  'packages/vue/package.json',
  'packages/react/package.json',
  'packages/nuxt/package.json'
];

const version = process.argv[2]
  || JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8')).version;

if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error(`Invalid version: ${version}`);
  process.exit(1);
}

PACKAGES.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { name } = JSON.parse(content);

  /**
   * Replace only the version line, to keep the file's field order and formatting
   */
  fs.writeFileSync(filePath, content.replace(/^( {2}"version": )"[^"]*"/m, `$1"${version}"`));

  console.log(`📦 ${name} -> ${version}`);
});
