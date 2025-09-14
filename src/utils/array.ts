/**
 * Removes specified items from an array.
 * @param array - The array to remove items from.
 * @param itemsToRemove - The items to remove from the array.
 * @returns A new array with the specified items removed.
 */
export const removeFromArray = <T>(array: T[], ...itemsToRemove: T[]): T[] =>
  array.filter((item) => !itemsToRemove.includes(item))

/**
 * Creates a new array with unique elements.
 *
 * @param array The input array.
 * @returns A new array with unique elements.
 */
export const createUniqueArray = <T>(array: T[]): T[] =>
  Array.from(new Set(array))

/**
 * Inserts an item into an array.
 * @param array The array to insert the item into.
 * @param item The item to insert.
 * @param inBefore Whether to insert the item before the existing elements.
 * @returns The modified array.
 */
export const insertToArray = <T>(
  array: T[],
  item: T,
  inBefore?: boolean
): T[] => (inBefore ? [item, ...array] : [...array, item])

/**
 * Finds the index of an item in an array.
 * @param array The input array.
 * @param callback The callback function.
 * @returns The index of the item in the array.
 */
export const findIndexInArray = <T>(
  array: T[],
  callback: (value: T, index: number, obj: T[]) => unknown
): number => array.findIndex(callback)
