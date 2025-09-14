import { Notify } from 'quasar'

export const getMessageFromError = (error: unknown) =>
  typeof error === 'string' ? error : JSON.stringify(error)

/**
 * Creates an error message notification with the specified message and color.
 *
 * @param error - The error object or message.
 * @param color - The color of the error message. Defaults to 'red'.
 * @param icon - The icon to display with the error message.
 * @param group - Determines whether the error message should be grouped with other notifications. Defaults to true.
 */
export const createNotify = (
  error: unknown,
  color = 'red',
  icon = 'warning',
  group = true
) => {
  // Get the message from the error object
  const message = getMessageFromError(error)

  // Create the error message notification
  Notify.create({
    message,
    color,
    icon,
    group,
  })
}
