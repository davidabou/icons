import { execFileSync } from 'node:child_process'
import { appendFileSync, readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Version step of the Release workflow (.github/workflows/npm-publish.yml), run with Bun:
 *
 *   bun .github/scripts/release.ts next-version <auto|patch|minor|major>
 *
 * Finds the last release, computes the next version from the Conventional Commits since then,
 * and writes `version`, `base` and `notes-filter` to the step outputs ($GITHUB_OUTPUT). The release
 * notes are written by changelogithub, from the same commits.
 *
 * Only the commits that touch the published packages count: a `feat(site):` commit changes neither
 * the version nor the release notes.
 */

type Bump = 'patch' | 'minor' | 'major'

interface Commit {
  type: string
  breaking: boolean
}

const ROOT_DIR = path.resolve(import.meta.dirname, '..', '..')

/**
 * Sources of the published packages (src/ holds the icons and the generated core package)
 */
const PACKAGE_PATHS = ['src', 'packages/vue', 'packages/react', 'packages/nuxt', 'package.json']

/**
 * Conventional Commit subject: type(scope)!: text
 */
const SUBJECT = /^(?<type>[a-z]+)(?:\([^)]*\))?(?<bang>!)?: /

function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: ROOT_DIR, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

function fail(message: string): never {
  console.error(`::error::${message}`)
  process.exit(1)
}

/**
 * Commits between two refs that touch the published packages, without merges
 */
function getCommits(from: string, to: string): Commit[] {
  const log = git('log', '--no-merges', '--format=%s%x1f%b%x1e', `${from}..${to}`, '--', ...PACKAGE_PATHS)

  return log.split('\x1e').filter(Boolean).map((entry) => {
    const [subject = '', body = ''] = entry.trim().split('\x1f')
    const { type = '', bang } = SUBJECT.exec(subject)?.groups ?? {}

    return { type, breaking: Boolean(bang) || /^BREAKING CHANGE:/m.test(body) }
  })
}

/**
 * Last release: the latest vx.y.z tag, or the last "chore: release x.y.z" commit (releases made before the tags)
 */
function findLastRelease(): string {
  try {
    return git('rev-parse', `${git('describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*')}^{commit}`)
  } catch {
    return git('log', '-1', '--format=%H', '--grep=^chore: release [0-9]') || fail('No previous release found')
  }
}

function nextVersion(bump: string): void {
  if (!['auto', 'patch', 'minor', 'major'].includes(bump)) {
    fail(`Invalid bump: ${bump}`)
  }

  const base = findLastRelease()
  const commits = getCommits(base, 'HEAD')

  if (!commits.length) {
    fail(`No change to the packages since the last release (${base})`)
  }

  const { version: current } = JSON.parse(readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8')) as { version: string }
  const [core = ''] = current.split('-')
  const [major = 0, minor = 0, patch = 0] = core.split('.').map(Number)

  let type: Bump = bump === 'auto'
    ? commits.some(commit => commit.breaking) ? 'major' : commits.some(commit => commit.type === 'feat') ? 'minor' : 'patch'
    : bump as Bump

  /**
   * Before 1.0, everything shifts down one level, as npm's caret ranges do (^0.3.0 is >=0.3.0 <0.4.0):
   * a breaking change bumps the minor version, and in auto mode a feature bumps the patch version,
   * so the apps on ^0.x.y still get the new icons
   */
  if (major === 0) {
    if (type === 'major') {
      type = 'minor'
    } else if (type === 'minor' && bump === 'auto') {
      type = 'patch'
    }
  }

  const version = {
    major: `${major + 1}.0.0`,
    minor: `${major}.${minor + 1}.0`,
    patch: `${major}.${minor}.${patch + 1}`
  }[type]

  if (git('tag', '--list', `v${version}`)) {
    fail(`Tag v${version} already exists`)
  }

  console.log(`🔖 ${current} → ${version} (${type})`)

  if (process.env.GITHUB_OUTPUT) {
    const notesFilter = PACKAGE_PATHS.map(file => `--commit-filter-by-paths ${file}`).join(' ')

    appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\nbase=${base}\nnotes-filter=${notesFilter}\n`)
  }
}

const [command, bump = 'auto'] = process.argv.slice(2)

if (command === 'next-version') {
  nextVersion(bump)
} else {
  fail('Usage: release.ts next-version <auto|patch|minor|major>')
}
