/* eslint-disable @typescript-eslint/no-explicit-any */
export class LocalStorageService {
/**
 * Retrieves the value associated with the given key from the local storage.
 *
 * @param {string} key - The key to retrieve the value for.
 * @returns {any} The value associated with the given key, or null if no value is found.
 */
  get (key: string): any {
    const value: string | null = localStorage.getItem(key)

    return value ? JSON.parse(value) : null
  }

  /**
   * A function to set a value in local storage.
   *
   * @param {string} key - The key to set the value for.
   * @param {any} value - The value to be set.
   * @return {void} This function does not return anything.
   */
  set (key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  /**
   * Removes an item from local storage based on the provided key.
   *
   * @param {string} key - The key of the item to be removed.
   * @return {void} This function does not return anything.
   */
  remove (key: string): void {
    localStorage.removeItem(key)
  }

  /**
   * Clears the local storage.
   *
   * @return {void}
   */
  clear (): void {
    localStorage.clear()
  }
}

/* // Usage
const localStorageService = new LocalStorageService()

// Set a value in localStorage
localStorageService.set('key', 'value')

// Get a value from localStorage
const storedValue = localStorageService.get('key')

// Remove a value from localStorage
localStorageService.remove('key')

// Clear all values from localStorage
localStorageService.clear() */
