import { REGEXP, } from 'src/utils/rules'

import { describe, expect, it, } from 'vitest'

describe('REGEXP required', () => {
  it('required should match valid input', () => {
    expect('test').toMatch(REGEXP.required)
  })

  it('required should not match invalid input', () => {
    const requiredString = 'Класс 1-3'

    expect(requiredString).toMatch(REGEXP.required)
  })

  it('word should match valid overfowLimit', () => {
    const longString = 'w'.repeat(255)

    expect(longString).toMatch(REGEXP.overfowLimit)
  })

  it('word should not match invalid overfowLimit', () => {
    const longString = 'w'.repeat(256)

    expect(longString).not.toMatch(REGEXP.overfowLimit)
  })
})

describe('REGEXP word', () => {
  it('should match valid onlyWord', () => {
    expect('Москва').toMatch(REGEXP.word)
  })

  it('should match invalid onlyWord', () => {
    expect('111').not.toMatch(REGEXP.word)
  })
})

describe('REGEXP string', () => {
  it('should match valid string', () => {
    expect('г. Москва').toMatch(REGEXP.string)
  })

  it('should match invalid string', () => {
    expect(' г. Москва ').not.toMatch(REGEXP.string)
  })
})

describe('REGEXP email', () => {
  it('email should match valid input', () => {
    expect('test@example.com').toMatch(REGEXP.email)
    expect('test1123@example456.org').toMatch(REGEXP.email)
  })

  it('email should not match invalid input', () => {
    expect('testexample.com').not.toMatch(REGEXP.email)
    expect('test1123@example456.777').not.toMatch(REGEXP.email)
  })

  it('email shouldn\'t be too long', () => {
    expect('test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_test_example.com').not.toMatch(REGEXP.email)
  })
})

describe('REGEXP password', () => {
  it('password should match valid input', () => {
    expect('Test123!').toMatch(REGEXP.password)
    expect('1esT!pass').toMatch(REGEXP.password)
    expect('2ThisIs@Passw0rd4').toMatch(REGEXP.password)
  })

  it('password should not match invalid input', () => {
    expect('password').not.toMatch(REGEXP.password)
    expect('123456').not.toMatch(REGEXP.password)
  })
})

describe('REGEXP phone number', () => {
  it('phone should match valid input', () => {
    expect('+7 (123) 456-78-90').toMatch(REGEXP.phone)
  })

  it('phone should not match invalid input', () => {
    expect('1234567890').not.toMatch(REGEXP.phone)
  })
})

describe('REGEXP word', () => {
  it('word should match valid word', () => {
    expect('Bred').toMatch(REGEXP.word)
    expect('Василий').toMatch(REGEXP.word)
  })

  it('word should not match invalid word', () => {
    expect('111').not.toMatch(REGEXP.word)
  })
})

describe('REGEXP fewLetters', () => {
  it('word should match valid fewLetters', () => {
    expect('Bred').toMatch(REGEXP.fewLetters)
    expect('Ян').toMatch(REGEXP.word)
  })

  it('word should match invalid fewLetters', () => {
    expect('B').not.toMatch(REGEXP.fewLetters)
    expect('Я').not.toMatch(REGEXP.fewLetters)
    expect('111').not.toMatch(REGEXP.word)
  })
})
