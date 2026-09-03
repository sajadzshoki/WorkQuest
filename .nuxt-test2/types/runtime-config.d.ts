import { RuntimeConfig as UserRuntimeConfig, PublicRuntimeConfig as UserPublicRuntimeConfig } from 'nuxt/schema'
  interface SharedRuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   databaseUrl: string,

   sessionSecret: string,

   sessionCookieName: string,

   sessionIssuer: string,

   sessionMaxAgeSeconds: number,

   sessionRenewThresholdSeconds: number,

   secureCookies: boolean,

   otpProvider: string,

   otpCodeLength: number,

   otpTtlSeconds: number,

   otpMaxAttempts: number,

   otpResendCooldownSeconds: number,

   otpMaxRequestsPerIpPerHour: number,

   otpHttpUrl: string,

   otpHttpApiKey: string,

   otpHttpTemplate: string,

   onboardingTicketTtlSeconds: number,

   bootstrapAdminPhone: string,

   icon: {
      serverKnownCssClasses: Array<any>,
   },
  }
  interface SharedPublicRuntimeConfig {
   appName: string,

   appUrl: string,

   appVersion: string,

   defaultLocale: string,

   supportEmail: string,

   i18n: {
      baseUrl: string,

      defaultLocale: string,

      rootRedirect: any,

      redirectStatusCode: number,

      skipSettingLocaleOnNavigate: boolean,

      locales: Array<{

      }>,

      detectBrowserLanguage: {
         alwaysRedirect: boolean,

         cookieCrossOrigin: boolean,

         cookieDomain: any,

         cookieKey: string,

         cookieSecure: boolean,

         fallbackLocale: string,

         redirectOn: string,

         useCookie: boolean,
      },

      experimental: {
         localeDetector: string,

         typedPages: boolean,

         typedOptionsAndMessages: boolean,

         alternateLinkCanonicalQueries: boolean,

         devCache: boolean,

         cacheLifetime: any,

         stripMessagesPayload: boolean,

         preload: boolean,

         strictSeo: boolean,

         nitroContextDetection: boolean,

         httpCacheDuration: number,

         compactRoutes: boolean,

         prerenderMessages: boolean,

         optimizeMessageBundling: boolean,
      },

      domainLocales: {
         fa: {
            domain: string,
         },

         en: {
            domain: string,
         },
      },
   },
  }
declare module '@nuxt/schema' {
  interface RuntimeConfig extends UserRuntimeConfig {}
  interface PublicRuntimeConfig extends UserPublicRuntimeConfig {}
}
declare module 'nuxt/schema' {
  interface RuntimeConfig extends SharedRuntimeConfig {}
  interface PublicRuntimeConfig extends SharedPublicRuntimeConfig {}
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: UserRuntimeConfig
        }
      }