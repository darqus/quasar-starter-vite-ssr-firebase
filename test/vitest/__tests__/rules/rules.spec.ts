import { REGEXP, } from 'src/utils/rules'

import { describe, expect, it, } from 'vitest'

describe('REGEXP required', () => {
  it('required should match valid input', () => {
    expect('test').toMatch(REGEXP.required)
  })

  it('required should not match invalid input', () => {
    const longString = 'a'.repeat(256)

    expect(longString).not.toMatch(REGEXP.required)
  })
})

describe('REGEXP email', () => {
  it('email should match valid input', () => {
    expect('test@example.com').toMatch(REGEXP.email)
  })

  it('email should not match invalid input', () => {
    expect('testexample.com').not.toMatch(REGEXP.email)
    expect('test1123@example456.org').toMatch(REGEXP.email)
    expect('test1123@example456.777').not.toMatch(REGEXP.email)
  })
})

describe('REGEXP password', () => {
  it('password should match valid input', () => {
    expect('ThisIsPassw0rd!').toMatch(REGEXP.password)
    expect('#thisIs!aPassw0rd').toMatch(REGEXP.password)
    expect('thisIs!aPassw0rd@').toMatch(REGEXP.password)
    expect('1#ThisIs!aPassw0rd@').toMatch(REGEXP.password)
  })

  it('password should not match invalid input', () => {
    expect('password').not.toMatch(REGEXP.password)
    expect('123456').not.toMatch(REGEXP.password)
  })

  it('password should not match invalid input because is too long', () => {
    expect('ThisIsPasswrd1123331233').not.toMatch(REGEXP.password)
    expect('#ThisIsPassw0rd!1123331233').not.toMatch(REGEXP.password)
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
  })

  it('word should match valid word', () => {
    expect('Василий').toMatch(REGEXP.word)
  })

  it('word should not match invalid word', () => {
    expect('111').not.toMatch(REGEXP.word)
  })
})

describe('REGEXP fewLetters', () => {
  it('word should match invalid fewLetters', () => {
    expect('B').not.toMatch(REGEXP.fewLetters)
  })

  it('word should match valid fewLetters', () => {
    expect('Bred').toMatch(REGEXP.fewLetters)
  })

  it('word should match invalid fewLetters', () => {
    expect('Я').not.toMatch(REGEXP.fewLetters)
  })

  it('word should not match valid fewLetters', () => {
    expect('Ян').toMatch(REGEXP.word)
  })

  it('word should not match invalid fewLetters', () => {
    expect('111').not.toMatch(REGEXP.word)
  })
})
