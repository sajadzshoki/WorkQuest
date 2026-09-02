import type { AcceptInvitationResponse, InvitationDetail } from '#shared/types/api'

interface PendingInvitationsResponse {
  status: 'invitation_pending'
  invitations: InvitationDetail[]
  expiresAt: string
}

/**
 * State for the "accept your invitation" step.
 *
 * Mirrors `useOnboarding`: the **ticket** stays in an httpOnly cookie and never
 * enters client state, so the only thing this composable knows is what
 * `GET /api/auth/invitations` chooses to return for it.
 *
 * As in `useOnboarding`, every read goes through `useRequestFetch()`. A plain
 * `$fetch` during SSR drops the incoming cookie, which made the wizard bounce
 * to /login even with a valid ticket — the same trap applies here.
 */
export function useInvitation() {
  const invitations = useState<InvitationDetail[] | null>('workquest:invitations', () => null)

  function apiFetcher(): <T>(url: string, init?: unknown) => Promise<T> {
    try {
      return useRequestFetch() as unknown as <T>(url: string, init?: unknown) => Promise<T>
    }
    catch {
      return $fetch as unknown as <T>(url: string, init?: unknown) => Promise<T>
    }
  }

  /** Load the pending invitations; `null` means there is no valid ticket. */
  async function load(): Promise<InvitationDetail[] | null> {
    const result = await apiFetcher()<PendingInvitationsResponse>('/api/auth/invitations')
      .catch(() => null)

    invitations.value = result?.invitations ?? null
    return invitations.value
  }

  async function hasTicket(): Promise<boolean> {
    return (await load()) !== null
  }

  async function accept(invitationId: string): Promise<AcceptInvitationResponse> {
    const result = await $fetch<AcceptInvitationResponse>('/api/auth/invitations/accept', {
      method: 'POST',
      body: { invitationId },
    })
    invitations.value = null
    return result
  }

  return { invitations, load, hasTicket, accept }
}
