import { execFileSync } from 'node:child_process'
import { appendFileSync, readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Steps of the Release workflow (.github/workflows/npm-publish.yml), run with Bun:
 *
 *   bun .github/scripts/release.ts next-version <auto|patch|minor|major>
 *     finds the last release, computes the next version from the Conventional Commits since then,
 *     and writes `version` and `base` to the step outputs ($GITHUB_OUTPUT)
 *
 *   bun .github/scripts/release.ts notes <version> <base>
 *     prints the release notes (Markdown) of the commits from <base> to the tag v<version>
 */

type Bump = 'patch' | 'minor' | 'major'

interface Commit {
  hash: string
  type: string
  scope: string
  breaking: boolean
  text: string
}

const ROOT_DIR = path.resolve(import.meta.dirname, '..', '..')

/**
 * Conventional Commit subject: type(scope)!: text
 */
const SUBJECT = /^(?<type>[a-z]+)(?:\((?<scope>[^)]*)\))?(?<bang>!)?: (?<text>.*)$/

/**
 * Commits made by this workflow, left out of the notes
 */
const RELEASE_COMMIT = /^chore: release \d/

function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: ROOT_DIR, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

function fail(message: string): never {
  console.error(`::error::${message}`)
  process.exit(1)
}

/**
 * Commits between two refs (oldest first), without merges
 */
function getCommits(from: string, to: string): Commit[] {
  const log = git('log', '--no-merges', '--reverse', '--format=%h%x1f%s%x1f%b%x1e', `${from}..${to}`)

  return log.split('\x1e').filter(Boolean).map((entry) => {
    const [hash = '', subject = '', body = ''] = entry.trim().split('\x1f')
    const { type = '', scope = '', bang, text = subject } = SUBJECT.exec(subject)?.groups ?? {}

    return {
      hash,
      type,
      scope,
      breaking: Boolean(bang) || /^BREAKING CHANGE:/m.test(body),
      text: RELEASE_COMMIT.test(subject) ? '' : text
    }
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
    fail(`No commit since the last release (${base})`)
  }

  const { version: current } = JSON.parse(readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8')) as { version: string }
  const [core = ''] = current.split('-')
  const [major = 0, minor = 0, patch = 0] = core.split('.').map(Number)

  let type: Bump = bump === 'auto'
    ? commits.some(commit => commit.breaking) ? 'major' : commits.some(commit => commit.type === 'feat') ? 'minor' : 'patch'
    : bump as Bump

  /**
   * Before 1.0, a breaking change bumps the minor version
   */
  if (type === 'major' && major === 0) {
    type = 'minor'
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
    appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\nbase=${base}\n`)
  }
}

function notes(version: string, base: string): void {
  const sections: Record<string, string[]> = {
    '⚠️ Breaking changes': [],
    'Features': [],
    'Fixes': [],
    'Other changes': []
  }

  for (const { hash, type, scope, breaking, text } of getCommits(base, `v${version}`)) {
    if (!text) {
      continue
    }

    const section = breaking ? '⚠️ Breaking changes' : type === 'feat' ? 'Features' : type === 'fix' ? 'Fixes' : 'Other changes'

    sections[section]?.push(`- ${scope ? `**${scope}:** ` : ''}${text} (${hash})`)
  }

  const repository = process.env.GITHUB_REPOSITORY ?? 'davidabou/icons'

  console.log([
    ...Object.entries(sections)
      .filter(([, lines]) => lines.length)
      .map(([title, lines]) => `## ${title}\n\n${lines.join('\n')}\n`),
    `**Full changelog**: https://github.com/${repository}/compare/${base}...v${version}`
  ].join('\n'))
}

const [command, ...args] = process.argv.slice(2)

if (command === 'next-version') {
  nextVersion(args[0] ?? 'auto')
} else if (command === 'notes' && args[0] && args[1]) {
  notes(args[0], args[1])
} else {
  fail('Usage: release.ts next-version <auto|patch|minor|major> | notes <version> <base>')
}
