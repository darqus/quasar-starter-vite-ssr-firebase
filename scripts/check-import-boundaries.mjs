#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

/**
 * Fails on imports that break the feature-sliced layout.
 *
 * Layers: pages/layouts → features (public index only) → shared → lib/types.
 * Domain code (features/<name>/api, features/<name>/model, lib) must stay
 * free of Vue/Quasar, and no file may reach into another feature's internals.
 *
 * Usage: node scripts/check-import-boundaries.mjs [dir ...]
 *
 * Exit code: 1 when a violation is found, 0 when clean.
 */
import { findViolations, formatViolation } from './lib/importBoundaries.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const DEFAULT_DIRS = [path.join(ROOT, 'src')]

const SCRIPT_EXTENSIONS = ['.ts', '.vue']

async function collectSourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        return entry.name === 'node_modules'
          ? []
          : collectSourceFiles(entryPath)
      }

      if (!entry.isFile() || entry.name.endsWith('.d.ts')) {
        return []
      }

      return SCRIPT_EXTENSIONS.some((extension) =>
        entry.name.endsWith(extension)
      )
        ? [entryPath]
        : []
    })
  )

  return files.flat()
}

const targets = process.argv.slice(2).filter((arg) => !arg.startsWith('-'))
const dirs =
  targets.length > 0 ? targets.map((dir) => path.resolve(dir)) : DEFAULT_DIRS

const files = (await Promise.all(dirs.map(collectSourceFiles))).flat()
const violations = []

for (const file of files.sort((a, b) => a.localeCompare(b))) {
  const relative = path.relative(ROOT, file).replace(/\\/g, '/')
  const source = await readFile(file, 'utf8')

  violations.push(...findViolations(relative, source))
}

if (violations.length === 0) {
  process.exit(0)
}

console.error('Import boundaries are violated:')
console.error('See plan/phase-4-structure.md for the layer rules.\n')

for (const violation of violations) {
  console.error(`  ${formatViolation(violation)}`)
}

process.exit(1)
