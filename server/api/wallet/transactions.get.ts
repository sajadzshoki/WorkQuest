import { walletTransactionQuerySchema } from '#shared/schemas'

import { requireAuth } from '../../utils/auth'
import { readValidatedQuery } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'
import { COIN_TRANSACTION_SELECT } from '../../utils/wallet'

/**
 * `GET /api/wallet/transactions` — the user's own coin statement, paged.
 *
 * Self-scoped like `GET /api/wallet`: the `userId` filter comes from the
 * session, never from the query string.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = readValidatedQuery(event, walletTransactionQuerySchema)
  const db = createTenantClient(auth)

  const where = {
    userId: auth.userId,
    ...(query.type ? { type: query.type } : {}),
  }

  const [items, total] = await Promise.all([
    db.coinTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: COIN_TRANSACTION_SELECT,
    }),
    db.coinTransaction.count({ where }),
  ])

  return { items, total, page: query.page, pageSize: query.pageSize }
})
