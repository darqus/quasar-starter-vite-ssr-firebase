import path from 'node:path'

/**
 * Import-boundary rules for the `src/` tree.
 *
 * The layout is feature-sliced:
 *
 *   pages/layouts → features (public index only) → shared → lib/types
 *
 * The guard keeps domain code independent from UI frameworks and stops
 * cross-feature imports from reaching into another feature's internals.
 * All functions are pure so they can be unit-tested without touching disk.
 */

const FEATURE_FILE_RE = /^src\/features\/([^/]+)\//
const FEATURE_PATH_RE = /^src\/features\/([^/]+)(?:\/|$)/

const SHARED_LIB = 'shared/lib'
const SHARED_FORM = 'shared/form'
const SHARED_UI = 'shared/ui'
const FEATURE_API = 'feature/api'
const FEATURE_ACTIONS = 'feature/actions'
const FEATURE_MODEL = 'feature/model'
const FEATURE_UI = 'feature/ui'
const FEATURE_ROOT = 'feature'

/** Returns the feature name for a path inside `src/features/<name>/`. */
export const featureOfFile = (file) => {
  const match = FEATURE_FILE_RE.exec(toPosix(file))
  return match?.[1] ?? null
}

/** Returns the feature name for a path pointing at `src/features/<name>`. */
export const featureOfTarget = (target) => {
  const match = FEATURE_PATH_RE.exec(toPosix(target))
  return match?.[1] ?? null
}

export const toPosix = (value) => value.replace(/\\/g, '/')

/**
 * Maps a project-relative file to the zone whose import rules apply.
 */
export const classifyFile = (file) => {
  const normalized = toPosix(file)

  if (normalized === 'src/stores/index.ts') {
    return { zone: 'store-setup', feature: null }
  }

  if (normalized.startsWith('src/shared/lib/')) {
    return { zone: SHARED_LIB, feature: null }
  }

  if (normalized.startsWith('src/shared/form/')) {
    return { zone: SHARED_FORM, feature: null }
  }

  if (normalized.startsWith('src/shared/ui/')) {
    return { zone: SHARED_UI, feature: null }
  }

  const feature = featureOfFile(normalized)

  if (feature !== null) {
    if (normalized.includes('/api/')) {
      return { zone: FEATURE_API, feature }
    }

    if (normalized.includes('/model/')) {
      return { zone: FEATURE_MODEL, feature }
    }

    if (normalized.includes('/actions/')) {
      return { zone: FEATURE_ACTIONS, feature }
    }

    if (normalized.includes('/ui/')) {
      return { zone: FEATURE_UI, feature }
    }

    return { zone: FEATURE_ROOT, feature }
  }

  if (normalized.startsWith('src/stores/')) {
    return { zone: 'stores', feature: null }
  }

  if (normalized.startsWith('src/pages/')) {
    return { zone: 'pages', feature: null }
  }

  if (normalized.startsWith('src/layouts/')) {
    return { zone: 'layouts', feature: null }
  }

  if (normalized.startsWith('src/router/')) {
    return { zone: 'router', feature: null }
  }

  if (normalized.startsWith('src/boot/')) {
    return { zone: 'boot', feature: null }
  }

  if (normalized.startsWith('src/lib/')) {
    return { zone: 'lib', feature: null }
  }

  if (normalized.startsWith('src/validation/')) {
    return { zone: 'validation', feature: null }
  }

  if (normalized.startsWith('src/types/')) {
    return { zone: 'types', feature: null }
  }

  return { zone: 'app', feature: null }
}

/**
 * Resolves an import specifier to a project-relative path.
 * Returns `null` for npm packages and virtual modules (`#q-app`).
 */
export const resolveSpecifier = (file, specifier) => {
  const normalizedFile = toPosix(file)

  if (specifier.startsWith('@/')) {
    return path.posix.normalize(`src/${specifier.slice(2)}`)
  }

  if (specifier.startsWith('.')) {
    return path.posix.normalize(
      path.posix.join(path.posix.dirname(normalizedFile), specifier)
    )
  }

  return null
}

/** True when a path is a public feature entry (`features/<name>` or its index). */
export const isPublicFeatureEntry = (target) => {
  const normalized = toPosix(target)

  if (normalized.startsWith('src/features/')) {
    const rest = normalized.slice('src/features/'.length)

    if (rest.length > 0 && !rest.includes('/')) {
      return true
    }
  }

  return /^src\/features\/[^/]+\/index\.(?:ts|js)$/.test(normalized)
}

/** True when the import crosses from outside into a feature's internals. */
export const isFeatureInternalImport = (file, target) => {
  const ownFeature = featureOfFile(file)
  const targetFeature = featureOfTarget(target)

  if (targetFeature === null) {
    return false
  }

  if (ownFeature === targetFeature) {
    return false
  }

  return !isPublicFeatureEntry(target)
}

const PACKAGE_PREFIXES = {
  [SHARED_LIB]: ['vue', 'quasar', 'vue-router', 'pinia', 'firebase'],
  [FEATURE_API]: ['vue', 'quasar', 'vue-router', 'pinia'],
  [FEATURE_ACTIONS]: ['quasar'],
  [FEATURE_MODEL]: ['quasar', 'vue-router'],
  stores: ['quasar', 'vue-router'],
  lib: ['vue', 'quasar', 'vue-router', 'pinia'],
  types: ['vue', 'quasar', 'vue-router', 'pinia'],
}

const FORBIDDEN_TARGETS = {
  [SHARED_LIB]: [
    'src/shared/form',
    'src/shared/ui',
    'src/features',
    'src/stores',
    'src/pages',
    'src/layouts',
    'src/router',
    'src/lib',
    'src/boot',
    'src/validation',
  ],
  [SHARED_FORM]: [
    'src/features',
    'src/stores',
    'src/pages',
    'src/layouts',
    'src/router',
    'src/lib',
    'src/boot',
  ],
  [SHARED_UI]: [
    'src/features',
    'src/stores',
    'src/pages',
    'src/layouts',
    'src/router',
    'src/lib',
    'src/boot',
  ],
  [FEATURE_API]: [
    'src/stores',
    'src/pages',
    'src/layouts',
    'src/router',
    'src/boot',
  ],
  [FEATURE_ACTIONS]: [
    'src/stores',
    'src/pages',
    'src/layouts',
    'src/router',
    'src/boot',
  ],
  [FEATURE_MODEL]: [
    'src/stores',
    'src/pages',
    'src/layouts',
    'src/router',
    'src/boot',
  ],
  [FEATURE_UI]: [
    'src/stores',
    'src/pages',
    'src/layouts',
    'src/router',
    'src/boot',
  ],
  stores: ['src/pages', 'src/layouts', 'src/router', 'src/boot'],
  pages: ['src/layouts', 'src/boot'],
  layouts: ['src/pages', 'src/boot'],
  lib: [
    'src/shared',
    'src/features',
    'src/stores',
    'src/pages',
    'src/layouts',
    'src/router',
    'src/boot',
  ],
  validation: [
    'src/shared/ui',
    'src/shared/form',
    'src/features',
    'src/stores',
    'src/pages',
    'src/layouts',
    'src/router',
    'src/boot',
  ],
  router: ['src/boot'],
  types: [
    'src/shared',
    'src/lib',
    'src/features',
    'src/stores',
    'src/pages',
    'src/layouts',
    'src/router',
    'src/boot',
  ],
}

const matchesPackage = (specifier, prefix) =>
  specifier === prefix || specifier.startsWith(`${prefix}/`)

const matchesTarget = (target, prefix) =>
  target === prefix || target.startsWith(`${prefix}/`)

/**
 * Checks one import. Returns `null` when allowed, otherwise the violated rule.
 */
export const checkImport = (file, specifier) => {
  const { zone } = classifyFile(file)
  const target = resolveSpecifier(file, specifier)

  if (target === null) {
    const forbidden = PACKAGE_PREFIXES[zone] ?? []

    if (forbidden.some((prefix) => matchesPackage(specifier, prefix))) {
      return {
        rule: 'framework-free',
        message: `${zone} must not depend on "${specifier}"`,
      }
    }

    return null
  }

  if (isFeatureInternalImport(file, target)) {
    return {
      rule: 'feature-internals',
      message: `import the feature public API instead: "@/features/${featureOfTarget(target)}"`,
    }
  }

  if (zone === 'pages' && matchesTarget(target, 'src/pages')) {
    const ownDir = path.posix.dirname(toPosix(file))

    if (!target.startsWith(`${ownDir}/`)) {
      return {
        rule: 'layer-direction',
        message: 'a page must not import another page',
      }
    }
  }

  const forbiddenTargets = FORBIDDEN_TARGETS[zone] ?? []

  if (forbiddenTargets.some((prefix) => matchesTarget(target, prefix))) {
    return {
      rule: 'layer-direction',
      message: `${zone} must not import "${target}"`,
    }
  }

  return null
}

const IMPORT_PATTERNS = [
  /^[ \t]*import\s+(?:type\s+)?(?:[\s\S]*?\sfrom\s+)?['"]([^'"]+)['"]/gm,
  /^[ \t]*export\s+(?:type\s+)?(?:\*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/gm,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
]

/**
 * Extracts static, re-export and dynamic imports with their line numbers.
 */
export const findImports = (source) => {
  const found = []
  const seen = new Set()

  for (const pattern of IMPORT_PATTERNS) {
    pattern.lastIndex = 0

    for (const match of source.matchAll(pattern)) {
      const specifier = match[1]

      if (specifier === undefined) {
        continue
      }

      const line = source.slice(0, match.index).split('\n').length
      const key = `${line}:${specifier}`

      if (!seen.has(key)) {
        seen.add(key)
        found.push({ line, specifier })
      }
    }
  }

  return found.sort((a, b) => a.line - b.line)
}

/** Returns every violation for a single file. */
export const findViolations = (file, source) =>
  findImports(source).flatMap(({ line, specifier }) => {
    const result = checkImport(file, specifier)

    return result === null ? [] : [{ file, line, specifier, ...result }]
  })

export const formatViolation = ({ file, line, specifier, message }) =>
  `${file}:${line}  import "${specifier}"  → ${message}`
