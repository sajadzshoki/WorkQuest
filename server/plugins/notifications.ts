import type { NotificationChannel } from '../utils/notifications'

import { registerNotificationChannel } from '../utils/notifications'

/**
 * Registers the external notification channels at boot.
 *
 * The in-app feed needs no channel — the row is the delivery. These three are
 * the *seam* for email, SMS and push: each activates only when the
 * environment actually configures a provider for it, and none is configured
 * in this deployment (by design — an unconfigured provider must never be
 * called, and a configured-but-unwired one must never fail a request).
 *
 * Wiring a real provider means implementing `deliver` here and setting the
 * matching env var; nothing else in the system changes.
 */

interface DsnChannel extends NotificationChannel {
  /** The env var whose presence means "this provider is configured". */
  envVar: string
}

function dsnChannel(key: string, envVar: string): DsnChannel {
  return {
    key,
    envVar,
    isConfigured: () => Boolean(process.env[envVar]),
    async deliver(delivery) {
      // Reached only when the env var is set. Until a real provider is
      // wired in, say so loudly instead of pretending the message went out.
      console.warn(
        `[workquest:notifications] "${key}" channel is configured (${envVar}) but has no provider wired; `
        + `dropping notification ${delivery.type} for user ${delivery.userId}`,
      )
    },
  }
}

export default defineNitroPlugin(() => {
  registerNotificationChannel(dsnChannel('email', 'NUXT_NOTIFICATION_EMAIL_DSN'))
  registerNotificationChannel(dsnChannel('sms', 'NUXT_NOTIFICATION_SMS_DSN'))
  registerNotificationChannel(dsnChannel('push', 'NUXT_NOTIFICATION_PUSH_DSN'))
})
