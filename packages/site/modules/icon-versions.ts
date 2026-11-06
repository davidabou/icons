import { gunzipSync } from 'node:zlib';
import { defineNuxtModule } from '@nuxt/kit';

const PACKAGE = '@davidabou/icons';
const REGISTRY = `https://registry.npmjs.org/${PACKAGE.replace('/', '%2F')}`;

const ICONIFY = 'https://api.iconify.design/collection?prefix=codex';

const fetchOk = async (url: string, accept?: string) => {
  const response = await fetch(url, { headers: accept ? { accept } : {}, signal: AbortSignal.timeout(10_000) });

  if (!response.ok) {
    throw new Error(`${url}: HTTP ${response.status}`);
  }

  return response;
};

/**
 * Reads one file out of an npm tarball (.tgz)
 */
function readFromTarball (tgz: ArrayBuffer, path: string): string | null {
  const tar = gunzipSync(Buffer.from(tgz));

  for (let offset = 0; offset + 512 <= tar.length;) {
    const name = tar.toString('utf8', offset, offset + 100).replace(/\0.*$/s, '');

    if (!name) {
      break;
    }
    const size = parseInt(tar.toString('utf8', offset + 124, offset + 136).replace(/\0.*$/s, '').trim(), 8) || 0;

    if (name === path) {
      return tar.toString('utf8', offset + 512, offset + 512 + size);
    }
    offset += 512 + Math.ceil(size / 512) * 512;
  }

  return null;
}

/**
 * For each icon export name (IconHeart…), the first published version of the package that
 * contains it, read from the published tarballs themselves: exactly what users can install.
 * Icons missing from every published version are absent from the map (= unreleased).
 */
export async function fetchReleases (): Promise<Record<string, string>> {
  const { versions } = await (await fetchOk(REGISTRY, 'application/vnd.npm.install-v1+json')).json() as {
    versions: Record<string, { dist: { tarball: string } }>;
  };

  /** Stable versions, oldest first */
  const published = Object.entries(versions)
    .filter(([version]) => !version.includes('-'))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));

  const typings = await Promise.all(published.map(async ([version, { dist }]) => ({
    version,
    dts: readFromTarball(await (await fetchOk(dist.tarball)).arrayBuffer(), 'package/dist/index.d.ts') ?? ''
  })));

  const releases: Record<string, string> = {};

  for (const { version, dts } of typings) {
    for (const [, name] of dts.matchAll(/export declare const (Icon\w+)/g)) {
      releases[name!] ??= version;
    }
  }

  return releases;
}

/**
 * Slugs of the icons available on Iconify, under the `codex` prefix (Iconify imports this repo,
 * with some delay after each new icon)
 */
export async function fetchIconify (): Promise<string[]> {
  const { uncategorized = [], categories = {} } = await (await fetchOk(ICONIFY)).json() as {
    uncategorized?: string[];
    categories?: Record<string, string[]>;
  };

  return [...uncategorized, ...Object.values(categories).flat()];
}

export default defineNuxtModule({
  meta: { name: 'icon-versions' },
  async setup (_, nuxt) {
    const [releases, iconify] = await Promise.all([
      fetchReleases().catch(error => {
        console.warn('[icon-versions] npm registry unavailable, versions will not be shown', error);

        return null;
      }),
      fetchIconify().catch(error => {
        console.warn('[icon-versions] Iconify API unavailable, the Iconify link will be shown for every icon', error);

        return null;
      })
    ]);

    // Untyped on purpose: Nuxt would otherwise infer the app config type from this build's value
    Object.assign(nuxt.options.appConfig as Record<string, unknown>, { iconReleases: releases, iconifyIcons: iconify });
  }
});
