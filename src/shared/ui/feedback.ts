import { ref, type Ref } from 'vue'

import { Loading, Notify } from 'quasar'

import { toErrorMessage } from '@/shared/lib/errors'

export type FeedbackRunOptions<T> = {
  loading?: boolean
  successMessage?: string | ((result: T) => string)
  successIcon?: string
  successColor?: string
  mapError?: (error: unknown) => string
  onSuccess?: (result: T) => Promise<void> | void
}

export type Feedback = {
  isPending: Ref<boolean>
  error: Ref<string | null>
  run: <T>(
    action: () => Promise<T>,
    options?: FeedbackRunOptions<T>
  ) => Promise<boolean>
}

/**
 * One place for the loading overlay, success notification and error mapping.
 * Returns `true` on success, so callers can reset forms or navigate.
 */
export const createFeedback = (): Feedback => {
  const isPending = ref(false)
  const error = ref<string | null>(null)

  const run = async <T>(
    action: () => Promise<T>,
    options: FeedbackRunOptions<T> = {}
  ): Promise<boolean> => {
    if (isPending.value) {
      return false
    }

    isPending.value = true
    error.value = null

    const showLoading = options.loading ?? true
    if (showLoading) {
      Loading.show()
    }

    try {
      const result = await action()
      await options.onSuccess?.(result)

      const message =
        typeof options.successMessage === 'function'
          ? options.successMessage(result)
          : options.successMessage

      if (message) {
        Notify.create({
          message,
          color: options.successColor ?? 'green-4',
          icon: options.successIcon ?? 'cloud_done',
          group: true,
        })
      }

      return true
    } catch (caught) {
      const message = options.mapError
        ? options.mapError(caught)
        : toErrorMessage(caught)

      error.value = message
      Notify.create({
        message,
        color: 'red-5',
        icon: 'warning',
        group: true,
      })

      return false
    } finally {
      isPending.value = false
      if (showLoading) {
        Loading.hide()
      }
    }
  }

  return { isPending, error, run }
}
