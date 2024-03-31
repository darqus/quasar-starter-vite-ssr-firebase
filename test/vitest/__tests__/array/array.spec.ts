import { createUniqueArray, findIndexInArray, insertToArray, removeFromArray, } from 'src/utils/array'

import { describe, expect, it, } from 'vitest'

describe('removeFromArray', () => {
  it('should remove specified items from an array', () => {
    const array = [ 1, 2, 3, 4, 5, ]
    const itemsToRemove = [ 2, 4, ]
    const result = removeFromArray(array, ...itemsToRemove)

    expect(result).toEqual([ 1, 3, 5, ])
  })

  it('should return a new array', () => {
    const array = [ 1, 2, 3, 4, 5, ]
    const itemsToRemove = [ 2, 4, ]
    const result = removeFromArray(array, ...itemsToRemove)

    expect(result).not.toBe(array)
  })

  it('should not modify the original array', () => {
    const array = [ 1, 2, 3, 4, 5, ]
    const itemsToRemove = [ 2, 4, ]

    removeFromArray(array, ...itemsToRemove)
    expect(array).toEqual([ 1, 2, 3, 4, 5, ])
  })

  it('should handle empty array', () => {
    const array: number[] = []
    const itemsToRemove = [ 2, 4, ]
    const result = removeFromArray(array, ...itemsToRemove)

    expect(result).toEqual([])
  })

  it('should handle empty itemsToRemove array', () => {
    const array = [ 1, 2, 3, 4, 5, ]
    const itemsToRemove: number[] = []
    const result = removeFromArray(array, ...itemsToRemove)

    expect(result).toEqual([ 1, 2, 3, 4, 5, ])
  })

  it('should handle array with no matching items', () => {
    const array = [ 1, 2, 3, 4, 5, ]
    const itemsToRemove = [ 6, 7, ]
    const result = removeFromArray(array, ...itemsToRemove)

    expect(result).toEqual([ 1, 2, 3, 4, 5, ])
  })

  it('should handle array with duplicate items', () => {
    const array = [ 1, 2, 2, 3, 4, 5, ]
    const itemsToRemove = [ 2, 4, ]
    const result = removeFromArray(array, ...itemsToRemove)

    expect(result).toEqual([ 1, 3, 5, ])
  })
})

describe('createUniqueArray', () => {
  it('should return an array with unique elements when given an array with duplicate elements', () => {
    const inputArray = [ 1, 2, 3, 2, 4, 1, 5, ]
    const expectedArray = [ 1, 2, 3, 4, 5, ]

    const result = createUniqueArray(inputArray)

    expect(result).toEqual(expectedArray)
  })

  it('should return an empty array when given an empty array', () => {
    const inputArray: number[] = []
    const expectedArray: number[] = []

    const result = createUniqueArray(inputArray)

    expect(result).toEqual(expectedArray)
  })

  it('should return an array with a single element when given an array with a single element', () => {
    const inputArray = [ 1, ]
    const expectedArray = [ 1, ]

    const result = createUniqueArray(inputArray)

    expect(result).toEqual(expectedArray)
  })
})

describe('insertToArray', () => {
  it('should insert an item at the end of the array when inBefore is false', () => {
    const arr = [ 1, 2, 3, ]
    const item = 4
    const result = insertToArray(arr, item, false)

    expect(result).toEqual([ 1, 2, 3, 4, ])
  })

  it('should insert an item at the beginning of the array when inBefore is true', () => {
    const arr = [ 1, 2, 3, ]
    const item = 0
    const result = insertToArray(arr, item, true)

    expect(result).toEqual([ 0, 1, 2, 3, ])
  })
})

describe('findIndexInArray', () => {
  it('should return the index of the item in the array', () => {
    const arr = [ 1, 2, 3, 4, 5, ]
    const callback = (value: number) => value === 3
    const expectedIndex = 2

    const result = findIndexInArray(arr, callback)

    expect(result).toEqual(expectedIndex)
  })

  it('should return -1 if the item is not found in the array', () => {
    const arr = [ 1, 2, 3, 4, 5, ]
    const callback = (value: number) => value === 6
    const expectedIndex = -1

    const result = findIndexInArray(arr, callback)

    expect(result).toEqual(expectedIndex)
  })

  it('should return the index of the first occurrence if the item appears multiple times in the array', () => {
    const arr = [ 1, 2, 3, 4, 5, 3, 6, ]
    const callback = (value: number) => value === 3
    const expectedIndex = 2

    const result = findIndexInArray(arr, callback)

    expect(result).toEqual(expectedIndex)
  })
})
