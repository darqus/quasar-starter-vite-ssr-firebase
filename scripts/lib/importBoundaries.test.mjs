import { describe, expect, it } from 'vitest'

import {
  checkImport,
  classifyFile,
  findImports,
  findViolations,
  isFeatureInternalImport,
  resolveSpecifier,
} from './importBoundaries.mjs'

const violation = (file, specifier) => checkImport(file, specifier)

describe('classifyFile', () => {
  it('maps feature layers', () => {
    expect(classifyFile('src/features/auth/api/authApi.ts')).toEqual({
      zone: 'feature/api',
      feature: 'auth',
    })
    expect(classifyFile('src/features/auth/model/session.ts')).toEqual({
      zone: 'feature/model',
      feature: 'auth',
    })
    expect(classifyFile('src/features/employees/ui/UserCardList.vue')).toEqual({
      zone: 'feature/ui',
      feature: 'employees',
    })
    expect(classifyFile('src/features/auth/index.ts')).toEqual({
      zone: 'feature',
      feature: 'auth',
    })
  })

  it('keeps the pinia setup outside store rules', () => {
    expect(classifyFile('src/stores/index.ts').zone).toBe('store-setup')
    expect(classifyFile('src/stores/theme.ts').zone).toBe('stores')
  })
})

describe('resolveSpecifier', () => {
  it('resolves the @/ alias and relative imports', () => {
    expect(
      resolveSpecifier('src/pages/home/HomePage.vue', '@/features/auth')
    ).toBe('src/features/auth')
    expect(
      resolveSpecifier('src/features/auth/model/session.ts', '../api/authApi')
    ).toBe('src/features/auth/api/authApi')
  })

  it('returns null for npm and virtual modules', () => {
    expect(resolveSpecifier('src/main.ts', 'pinia')).toBeNull()
    expect(resolveSpecifier('src/main.ts', '#q-app')).toBeNull()
  })
})

describe('feature public API', () => {
  it('allows pages to import the feature index', () => {
    expect(
      violation('src/pages/home/HomePage.vue', '@/features/employees')
    ).toBeNull()
  })

  it('forbids deep imports from outside the feature', () => {
    expect(
      violation('src/pages/home/HomePage.vue', '@/features/auth/model/session')
    ).toMatchObject({ rule: 'feature-internals' })
  })

  it('forbids cross-feature internals', () => {
    expect(
      violation(
        'src/features/auth/model/session.ts',
        '@/features/employees/model/store'
      )
    ).toMatchObject({ rule: 'feature-internals' })
  })

  it('allows a feature to use its own internals', () => {
    expect(
      violation(
        'src/features/auth/model/session.ts',
        '@/features/auth/api/authApi'
      )
    ).toBeNull()
  })

  it('does not treat index imports as internal', () => {
    expect(
      isFeatureInternalImport('src/pages/x.vue', 'src/features/auth')
    ).toBe(false)
    expect(
      isFeatureInternalImport('src/pages/x.vue', 'src/features/auth/index.ts')
    ).toBe(false)
  })
})

describe('framework-free layers', () => {
  it('keeps shared/lib free of Vue, Quasar and features', () => {
    expect(violation('src/shared/lib/theme.ts', 'vue')).toMatchObject({
      rule: 'framework-free',
    })
    expect(
      violation('src/shared/lib/date.ts', '@/features/auth')
    ).toMatchObject({
      rule: 'layer-direction',
    })
    expect(
      violation('src/shared/lib/errors.ts', '@/shared/form/types')
    ).toMatchObject({
      rule: 'layer-direction',
    })
  })

  it('allows shared/ui and shared/form to use Quasar', () => {
    expect(violation('src/shared/ui/feedback.ts', 'quasar')).toBeNull()
    expect(violation('src/shared/form/FormFields.vue', 'quasar')).toBeNull()
  })

  it('keeps feature api free of Vue/Quasar but allows Firebase', () => {
    expect(
      violation('src/features/employees/api/employeeRepository.ts', 'vue')
    ).toMatchObject({
      rule: 'framework-free',
    })
    expect(
      violation('src/features/employees/api/employeeRepository.ts', 'quasar')
    ).toMatchObject({
      rule: 'framework-free',
    })
    expect(
      violation(
        'src/features/employees/api/employeeRepository.ts',
        'firebase/firestore'
      )
    ).toBeNull()
  })

  it('keeps feature models free of Quasar', () => {
    expect(
      violation('src/features/auth/model/useAuthActions.ts', 'quasar')
    ).toMatchObject({
      rule: 'framework-free',
    })
  })

  it('allows page-scenario actions to navigate but not to use Quasar', () => {
    expect(
      violation('src/features/auth/actions/useAuthActions.ts', 'vue-router')
    ).toBeNull()
    expect(
      violation('src/features/auth/actions/useAuthActions.ts', 'quasar')
    ).toMatchObject({ rule: 'framework-free' })
  })

  it('forbids stores from importing Quasar or pages', () => {
    expect(violation('src/stores/theme.ts', 'quasar')).toMatchObject({
      rule: 'framework-free',
    })
    expect(
      violation('src/stores/theme.ts', '@/pages/home/HomePage.vue')
    ).toMatchObject({
      rule: 'layer-direction',
    })
  })

  it('forbids lib from importing shared or features', () => {
    expect(
      violation('src/lib/firebase/client.ts', '@/features/auth')
    ).toMatchObject({
      rule: 'layer-direction',
    })
    expect(
      violation('src/lib/firebase/client.ts', '@/shared/lib/errors')
    ).toMatchObject({
      rule: 'layer-direction',
    })
  })
})

describe('page and layout rules', () => {
  it('forbids pages importing other pages', () => {
    expect(
      violation('src/pages/home/HomePage.vue', '@/pages/auth/LoginPage.vue')
    ).toMatchObject({ rule: 'layer-direction' })
  })

  it('allows a page to import its own local components', () => {
    expect(
      violation('src/pages/home/HomePage.vue', './components/Tabs.vue')
    ).toBeNull()
  })

  it('allows layouts to import layout components and router helpers', () => {
    expect(
      violation(
        'src/layouts/MainLayout.vue',
        '@/layouts/components/SidebarDrawer.vue'
      )
    ).toBeNull()
    expect(
      violation('src/layouts/components/SidebarDrawer.vue', '@/router/menu')
    ).toBeNull()
  })

  it('allows validation to use shared/lib helpers', () => {
    expect(
      violation('src/validation/zod-helpers.ts', '@/shared/lib/date')
    ).toBeNull()
  })
})

describe('findImports', () => {
  it('finds static, re-export and dynamic imports with line numbers', () => {
    const source = `import { a } from 'vue'

export { b } from '@/features/auth'

const page = () => import('@/pages/home/HomePage.vue')
`

    expect(findImports(source)).toEqual([
      { line: 1, specifier: 'vue' },
      { line: 3, specifier: '@/features/auth' },
      { line: 5, specifier: '@/pages/home/HomePage.vue' },
    ])
  })

  it('finds side-effect imports', () => {
    expect(findImports("import '@/lib/firebase/client'\n")).toEqual([
      { line: 1, specifier: '@/lib/firebase/client' },
    ])
  })

  it('finds multiline imports and re-exports', () => {
    const source = `import {
  a,
  b,
} from '@/features/auth'

export {
  c,
} from '@/features/employees'
`

    expect(findImports(source)).toEqual([
      { line: 1, specifier: '@/features/auth' },
      { line: 6, specifier: '@/features/employees' },
    ])
  })
})

describe('findViolations', () => {
  it('reports the file, line and rule', () => {
    const source = `import { useStoreAuth } from '@/features/auth/model/session'\n`

    expect(findViolations('src/pages/account/AccountPage.vue', source)).toEqual(
      [
        {
          file: 'src/pages/account/AccountPage.vue',
          line: 1,
          specifier: '@/features/auth/model/session',
          rule: 'feature-internals',
          message: 'import the feature public API instead: "@/features/auth"',
        },
      ]
    )
  })
})
