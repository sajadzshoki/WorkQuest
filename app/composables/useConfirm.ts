/** The shape of one confirmation request. */
export interface ConfirmOptions {
  /** The action being confirmed, e.g. «حذف کارمند». */
  title: string
  /** The full question with the subject's name interpolated. */
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Destructive actions are red; everything else is primary. */
  tone?: 'primary' | 'error'
  icon?: string
}

/**
 * Ask the user before doing something irreversible.
 *
 * Resolves `true` only when the confirm button is clicked — a dismissed
 * dialog (esc, backdrop, cancel) is a "no". The dialog itself lives once, in
 * the default layout, so there is nothing to mount at the call site.
 */
export function useConfirm() {
  return (options: ConfirmOptions): Promise<boolean> =>
    new Promise((resolve) => {
      const state = useState<{ options: ConfirmOptions, resolve: (accepted: boolean) => void } | null>(
        'workquest:confirm',
        () => null,
      )
      // A second confirm while one is open resolves the first as "no" rather
      // than silently dropping its promise.
      state.value?.resolve(false)
      state.value = { options, resolve }
    })
}
