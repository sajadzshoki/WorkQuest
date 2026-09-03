declare global {
  const ACTIVE_TASK_STATUSES: typeof import('../../shared/utils/task').ACTIVE_TASK_STATUSES
  const CLOSED_TASK_STATUSES: typeof import('../../shared/utils/task').CLOSED_TASK_STATUSES
  const H3Error: typeof import('../../node_modules/h3/dist/index').H3Error
  const H3Event: typeof import('../../node_modules/h3/dist/index').H3Event
  const MEMBER_SELECT: typeof import('../../server/utils/members').MEMBER_SELECT
  const OPEN_TASK_STATUSES: typeof import('../../shared/utils/task').OPEN_TASK_STATUSES
  const OtpDeliveryError: typeof import('../../server/utils/otp').OtpDeliveryError
  const PERMISSIONS: typeof import('../../shared/utils/permissions').PERMISSIONS
  const PRIORITY_WEIGHT: typeof import('../../shared/utils/task').PRIORITY_WEIGHT
  const REVIEW_DECISIONS: typeof import('../../shared/utils/task').REVIEW_DECISIONS
  const ROLES: typeof import('../../shared/utils/permissions').ROLES
  const ROLE_RANK: typeof import('../../shared/utils/permissions').ROLE_RANK
  const TASK_ACTIONS: typeof import('../../shared/utils/task').TASK_ACTIONS
  const TASK_PRIORITIES: typeof import('../../shared/utils/task').TASK_PRIORITIES
  const TASK_SELECT: typeof import('../../server/utils/tasks').TASK_SELECT
  const TASK_STATUSES: typeof import('../../shared/utils/task').TASK_STATUSES
  const TASK_TRANSITIONS: typeof import('../../shared/utils/task').TASK_TRANSITIONS
  const TENANT_MODELS: typeof import('../../server/utils/tenant').TENANT_MODELS
  const __buildAssetsURL: typeof import('../../node_modules/@nuxt/nitro-server/dist/runtime/utils/paths').buildAssetsURL
  const __publicAssetsURL: typeof import('../../node_modules/@nuxt/nitro-server/dist/runtime/utils/paths').publicAssetsURL
  const apiError: typeof import('../../server/utils/http').apiError
  const appendCorsHeaders: typeof import('../../node_modules/h3/dist/index').appendCorsHeaders
  const appendCorsPreflightHeaders: typeof import('../../node_modules/h3/dist/index').appendCorsPreflightHeaders
  const appendHeader: typeof import('../../node_modules/h3/dist/index').appendHeader
  const appendHeaders: typeof import('../../node_modules/h3/dist/index').appendHeaders
  const appendResponseHeader: typeof import('../../node_modules/h3/dist/index').appendResponseHeader
  const appendResponseHeaders: typeof import('../../node_modules/h3/dist/index').appendResponseHeaders
  const assertAssignable: typeof import('../../server/utils/tasks').assertAssignable
  const assertCanLead: typeof import('../../server/utils/members').assertCanLead
  const assertMethod: typeof import('../../node_modules/h3/dist/index').assertMethod
  const assertTransitionAllowed: typeof import('../../server/utils/tasks').assertTransitionAllowed
  const assertUsableTeam: typeof import('../../server/utils/tasks').assertUsableTeam
  const availableActions: typeof import('../../shared/utils/task').availableActions
  const bootstrapCompanyDefaults: typeof import('../../server/utils/onboarding').bootstrapCompanyDefaults
  const cachedEventHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').cachedEventHandler
  const cachedFunction: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').cachedFunction
  const calendarLocale: typeof import('../../shared/utils/format').calendarLocale
  const callNodeListener: typeof import('../../node_modules/h3/dist/index').callNodeListener
  const can: typeof import('../../shared/utils/permissions').can
  const canEditTeam: typeof import('../../shared/utils/member-scope').canEditTeam
  const canLeadRole: typeof import('../../shared/utils/member-scope').canLeadRole
  const canManageTask: typeof import('../../server/utils/tasks').canManageTask
  const canTransition: typeof import('../../shared/utils/task').canTransition
  const checkTransition: typeof import('../../shared/utils/task').checkTransition
  const clearInvitationCookie: typeof import('../../server/utils/invitation').clearInvitationCookie
  const clearOnboardingCookie: typeof import('../../server/utils/onboarding').clearOnboardingCookie
  const clearResponseHeaders: typeof import('../../node_modules/h3/dist/index').clearResponseHeaders
  const clearSession: typeof import('../../node_modules/h3/dist/index').clearSession
  const clearSessionCookie: typeof import('../../server/utils/session').clearSessionCookie
  const completionRate: typeof import('../../shared/utils/task').completionRate
  const computeLevelProgress: typeof import('../../shared/utils/xp').computeLevelProgress
  const consoleOtpProvider: typeof import('../../server/utils/otp').consoleOtpProvider
  const consumeInvitationTicket: typeof import('../../server/utils/invitation').consumeInvitationTicket
  const consumeOnboardingTicket: typeof import('../../server/utils/onboarding').consumeOnboardingTicket
  const createApp: typeof import('../../node_modules/h3/dist/index').createApp
  const createAppEventHandler: typeof import('../../node_modules/h3/dist/index').createAppEventHandler
  const createError: typeof import('../../node_modules/h3/dist/index').createError
  const createEvent: typeof import('../../node_modules/h3/dist/index').createEvent
  const createEventStream: typeof import('../../node_modules/h3/dist/index').createEventStream
  const createRouter: typeof import('../../node_modules/h3/dist/index').createRouter
  const createTenantClient: typeof import('../../server/utils/tenant').createTenantClient
  const databaseUrl: typeof import('../../server/utils/db').databaseUrl
  const daysUntilDue: typeof import('../../shared/utils/task').daysUntilDue
  const defaultContentType: typeof import('../../node_modules/h3/dist/index').defaultContentType
  const defaultMinXp: typeof import('../../shared/utils/xp').defaultMinXp
  const defineAppConfig: typeof import('../../node_modules/@nuxt/nitro-server/dist/runtime/utils/config').defineAppConfig
  const defineCachedEventHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').defineCachedEventHandler
  const defineCachedFunction: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').defineCachedFunction
  const defineEventHandler: typeof import('../../node_modules/h3/dist/index').defineEventHandler
  const defineI18nConfig: typeof import('../../node_modules/@nuxtjs/i18n/dist/runtime/composables/shared').defineI18nConfig
  const defineI18nLocale: typeof import('../../node_modules/@nuxtjs/i18n/dist/runtime/composables/shared').defineI18nLocale
  const defineI18nLocaleDetector: typeof import('../../node_modules/@nuxtjs/i18n/dist/runtime/composables/server').defineI18nLocaleDetector
  const defineLazyEventHandler: typeof import('../../node_modules/h3/dist/index').defineLazyEventHandler
  const defineNitroErrorHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/error/utils').defineNitroErrorHandler
  const defineNitroPlugin: typeof import('../../node_modules/nitropack/dist/runtime/internal/plugin').defineNitroPlugin
  const defineNodeListener: typeof import('../../node_modules/h3/dist/index').defineNodeListener
  const defineNodeMiddleware: typeof import('../../node_modules/h3/dist/index').defineNodeMiddleware
  const defineRenderHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/renderer').defineRenderHandler
  const defineRequestMiddleware: typeof import('../../node_modules/h3/dist/index').defineRequestMiddleware
  const defineResponseMiddleware: typeof import('../../node_modules/h3/dist/index').defineResponseMiddleware
  const defineRouteMeta: typeof import('../../node_modules/nitropack/dist/runtime/internal/meta').defineRouteMeta
  const defineTask: typeof import('../../node_modules/nitropack/dist/runtime/internal/task').defineTask
  const defineWebSocket: typeof import('../../node_modules/h3/dist/index').defineWebSocket
  const defineWebSocketHandler: typeof import('../../node_modules/h3/dist/index').defineWebSocketHandler
  const deleteCookie: typeof import('../../node_modules/h3/dist/index').deleteCookie
  const disconnectPrisma: typeof import('../../server/utils/db').disconnectPrisma
  const dynamicEventHandler: typeof import('../../node_modules/h3/dist/index').dynamicEventHandler
  const errorHandler: typeof import('../../server/utils/error-handler').default
  const errors: typeof import('../../server/utils/http').errors
  const eventHandler: typeof import('../../node_modules/h3/dist/index').eventHandler
  const expireStaleInvitations: typeof import('../../server/utils/invitation').expireStaleInvitations
  const fetchWithEvent: typeof import('../../node_modules/h3/dist/index').fetchWithEvent
  const findInvitationTicket: typeof import('../../server/utils/invitation').findInvitationTicket
  const findOnboardingTicket: typeof import('../../server/utils/onboarding').findOnboardingTicket
  const findTransition: typeof import('../../shared/utils/task').findTransition
  const formatCompactNumber: typeof import('../../shared/utils/format').formatCompactNumber
  const formatDate: typeof import('../../shared/utils/format').formatDate
  const formatNumber: typeof import('../../shared/utils/format').formatNumber
  const formatPercent: typeof import('../../shared/utils/format').formatPercent
  const formatPhone: typeof import('../../shared/utils/format').formatPhone
  const formatRelativeDate: typeof import('../../shared/utils/format').formatRelativeDate
  const fromNodeMiddleware: typeof import('../../node_modules/h3/dist/index').fromNodeMiddleware
  const fromPlainHandler: typeof import('../../node_modules/h3/dist/index').fromPlainHandler
  const fromWebHandler: typeof import('../../node_modules/h3/dist/index').fromWebHandler
  const generateOtpCode: typeof import('../../server/utils/crypto').generateOtpCode
  const getAuth: typeof import('../../server/utils/auth').getAuth
  const getCookie: typeof import('../../node_modules/h3/dist/index').getCookie
  const getCookieLocale: typeof import('../../node_modules/@intlify/utils/dist/h3').getCookieLocale
  const getHeader: typeof import('../../node_modules/h3/dist/index').getHeader
  const getHeaderLanguage: typeof import('../../node_modules/@intlify/utils/dist/h3').getHeaderLanguage
  const getHeaderLanguages: typeof import('../../node_modules/@intlify/utils/dist/h3').getHeaderLanguages
  const getHeaderLocale: typeof import('../../node_modules/@intlify/utils/dist/h3').getHeaderLocale
  const getHeaderLocales: typeof import('../../node_modules/@intlify/utils/dist/h3').getHeaderLocales
  const getHeaders: typeof import('../../node_modules/h3/dist/index').getHeaders
  const getManagedUserIds: typeof import('../../server/utils/auth').getManagedUserIds
  const getMethod: typeof import('../../node_modules/h3/dist/index').getMethod
  const getPathLocale: typeof import('../../node_modules/@intlify/utils/dist/h3').getPathLocale
  const getProxyRequestHeaders: typeof import('../../node_modules/h3/dist/index').getProxyRequestHeaders
  const getQuery: typeof import('../../node_modules/h3/dist/index').getQuery
  const getQueryLocale: typeof import('../../node_modules/@intlify/utils/dist/h3').getQueryLocale
  const getRequestFingerprint: typeof import('../../node_modules/h3/dist/index').getRequestFingerprint
  const getRequestHeader: typeof import('../../node_modules/h3/dist/index').getRequestHeader
  const getRequestHeaders: typeof import('../../node_modules/h3/dist/index').getRequestHeaders
  const getRequestHost: typeof import('../../node_modules/h3/dist/index').getRequestHost
  const getRequestIP: typeof import('../../node_modules/h3/dist/index').getRequestIP
  const getRequestPath: typeof import('../../node_modules/h3/dist/index').getRequestPath
  const getRequestProtocol: typeof import('../../node_modules/h3/dist/index').getRequestProtocol
  const getRequestURL: typeof import('../../node_modules/h3/dist/index').getRequestURL
  const getRequestWebStream: typeof import('../../node_modules/h3/dist/index').getRequestWebStream
  const getResponseHeader: typeof import('../../node_modules/h3/dist/index').getResponseHeader
  const getResponseHeaders: typeof import('../../node_modules/h3/dist/index').getResponseHeaders
  const getResponseStatus: typeof import('../../node_modules/h3/dist/index').getResponseStatus
  const getResponseStatusText: typeof import('../../node_modules/h3/dist/index').getResponseStatusText
  const getRouteRules: typeof import('../../node_modules/nitropack/dist/runtime/internal/route-rules').getRouteRules
  const getRouterParam: typeof import('../../node_modules/h3/dist/index').getRouterParam
  const getRouterParams: typeof import('../../node_modules/h3/dist/index').getRouterParams
  const getSession: typeof import('../../node_modules/h3/dist/index').getSession
  const getValidatedQuery: typeof import('../../node_modules/h3/dist/index').getValidatedQuery
  const getValidatedRouterParams: typeof import('../../node_modules/h3/dist/index').getValidatedRouterParams
  const handleCacheHeaders: typeof import('../../node_modules/h3/dist/index').handleCacheHeaders
  const handleCors: typeof import('../../node_modules/h3/dist/index').handleCors
  const hashOtpCode: typeof import('../../server/utils/crypto').hashOtpCode
  const httpOtpProvider: typeof import('../../server/utils/otp').httpOtpProvider
  const isCorsOriginAllowed: typeof import('../../node_modules/h3/dist/index').isCorsOriginAllowed
  const isDueToday: typeof import('../../shared/utils/task').isDueToday
  const isError: typeof import('../../node_modules/h3/dist/index').isError
  const isEvent: typeof import('../../node_modules/h3/dist/index').isEvent
  const isEventHandler: typeof import('../../node_modules/h3/dist/index').isEventHandler
  const isMethod: typeof import('../../node_modules/h3/dist/index').isMethod
  const isOverdue: typeof import('../../shared/utils/task').isOverdue
  const isPreflightRequest: typeof import('../../node_modules/h3/dist/index').isPreflightRequest
  const isRole: typeof import('../../shared/utils/permissions').isRole
  const isStream: typeof import('../../node_modules/h3/dist/index').isStream
  const isTaskAction: typeof import('../../shared/utils/task').isTaskAction
  const isTaskStatus: typeof import('../../shared/utils/task').isTaskStatus
  const isTenantModel: typeof import('../../server/utils/tenant').isTenantModel
  const isWebResponse: typeof import('../../node_modules/h3/dist/index').isWebResponse
  const issueInvitationTicket: typeof import('../../server/utils/invitation').issueInvitationTicket
  const issueOnboardingTicket: typeof import('../../server/utils/onboarding').issueOnboardingTicket
  const issueSession: typeof import('../../server/utils/auth').issueSession
  const lazyEventHandler: typeof import('../../node_modules/h3/dist/index').lazyEventHandler
  const ledTeamIds: typeof import('../../server/utils/members').ledTeamIds
  const ledTeamIdsFor: typeof import('../../server/utils/tasks').ledTeamIdsFor
  const listPendingInvitationsForPhone: typeof import('../../server/utils/invitation').listPendingInvitationsForPhone
  const loadVisibleTask: typeof import('../../server/utils/tasks').loadVisibleTask
  const maxAssignableRole: typeof import('../../shared/utils/member-scope').maxAssignableRole
  const memberPermissions: typeof import('../../shared/utils/member-scope').memberPermissions
  const nextStatus: typeof import('../../shared/utils/task').nextStatus
  const nitroPlugin: typeof import('../../node_modules/nitropack/dist/runtime/internal/plugin').nitroPlugin
  const normalizeIranianPhone: typeof import('../../shared/utils/format').normalizeIranianPhone
  const notifyTask: typeof import('../../server/utils/tasks').notifyTask
  const numberLocale: typeof import('../../shared/utils/format').numberLocale
  const otpSettings: typeof import('../../server/utils/otp').otpSettings
  const parseCookies: typeof import('../../node_modules/h3/dist/index').parseCookies
  const promisifyNodeListener: typeof import('../../node_modules/h3/dist/index').promisifyNodeListener
  const proxyRequest: typeof import('../../node_modules/h3/dist/index').proxyRequest
  const readBody: typeof import('../../node_modules/h3/dist/index').readBody
  const readFormData: typeof import('../../node_modules/h3/dist/index').readFormData
  const readInvitationCookie: typeof import('../../server/utils/invitation').readInvitationCookie
  const readMultipartFormData: typeof import('../../node_modules/h3/dist/index').readMultipartFormData
  const readOnboardingCookie: typeof import('../../server/utils/onboarding').readOnboardingCookie
  const readRawBody: typeof import('../../node_modules/h3/dist/index').readRawBody
  const readSessionToken: typeof import('../../server/utils/session').readSessionToken
  const readValidated: typeof import('../../server/utils/http').readValidated
  const readValidatedBody: typeof import('../../node_modules/h3/dist/index').readValidatedBody
  const readValidatedQuery: typeof import('../../server/utils/http').readValidatedQuery
  const recordTaskEvent: typeof import('../../server/utils/tasks').recordTaskEvent
  const rejectSecondMembership: typeof import('../../server/utils/members').rejectSecondMembership
  const removeResponseHeader: typeof import('../../node_modules/h3/dist/index').removeResponseHeader
  const requireAuth: typeof import('../../server/utils/auth').requireAuth
  const requireInvitationTicket: typeof import('../../server/utils/invitation').requireInvitationTicket
  const requireOnboardingTicket: typeof import('../../server/utils/onboarding').requireOnboardingTicket
  const requirePermission: typeof import('../../server/utils/auth').requirePermission
  const reserveCompanySlug: typeof import('../../server/utils/onboarding').reserveCompanySlug
  const resolveLevel: typeof import('../../shared/utils/xp').resolveLevel
  const resolveOtpProvider: typeof import('../../server/utils/otp').resolveOtpProvider
  const resolveVisibleUserIds: typeof import('../../server/utils/auth').resolveVisibleUserIds
  const roleAtLeast: typeof import('../../shared/utils/permissions').roleAtLeast
  const roleAtMost: typeof import('../../shared/utils/member-scope').roleAtMost
  const runTask: typeof import('../../node_modules/nitropack/dist/runtime/internal/task').runTask
  const sanitizeStatusCode: typeof import('../../node_modules/h3/dist/index').sanitizeStatusCode
  const sanitizeStatusMessage: typeof import('../../node_modules/h3/dist/index').sanitizeStatusMessage
  const sealSession: typeof import('../../node_modules/h3/dist/index').sealSession
  const send: typeof import('../../node_modules/h3/dist/index').send
  const sendError: typeof import('../../node_modules/h3/dist/index').sendError
  const sendIterable: typeof import('../../node_modules/h3/dist/index').sendIterable
  const sendNoContent: typeof import('../../node_modules/h3/dist/index').sendNoContent
  const sendProxy: typeof import('../../node_modules/h3/dist/index').sendProxy
  const sendRedirect: typeof import('../../node_modules/h3/dist/index').sendRedirect
  const sendStream: typeof import('../../node_modules/h3/dist/index').sendStream
  const sendWebResponse: typeof import('../../node_modules/h3/dist/index').sendWebResponse
  const serveStatic: typeof import('../../node_modules/h3/dist/index').serveStatic
  const setCookie: typeof import('../../node_modules/h3/dist/index').setCookie
  const setCookieLocale: typeof import('../../node_modules/@intlify/utils/dist/h3').setCookieLocale
  const setHeader: typeof import('../../node_modules/h3/dist/index').setHeader
  const setHeaders: typeof import('../../node_modules/h3/dist/index').setHeaders
  const setResponseHeader: typeof import('../../node_modules/h3/dist/index').setResponseHeader
  const setResponseHeaders: typeof import('../../node_modules/h3/dist/index').setResponseHeaders
  const setResponseStatus: typeof import('../../node_modules/h3/dist/index').setResponseStatus
  const setSessionCookie: typeof import('../../server/utils/session').setSessionCookie
  const signSessionToken: typeof import('../../server/utils/session').signSessionToken
  const slugify: typeof import('../../shared/utils/format').slugify
  const splitCookiesString: typeof import('../../node_modules/h3/dist/index').splitCookiesString
  const startSession: typeof import('../../server/utils/auth').startSession
  const streakProgressPercent: typeof import('../../shared/utils/xp').streakProgressPercent
  const taskVisibleUserIds: typeof import('../../server/utils/tasks').taskVisibleUserIds
  const teamDetail: typeof import('../../server/utils/members').teamDetail
  const toCompanySummary: typeof import('../../server/utils/auth').toCompanySummary
  const toEventHandler: typeof import('../../node_modules/h3/dist/index').toEventHandler
  const toInvitationDetail: typeof import('../../server/utils/invitation').toInvitationDetail
  const toNodeListener: typeof import('../../node_modules/h3/dist/index').toNodeListener
  const toPlainHandler: typeof import('../../node_modules/h3/dist/index').toPlainHandler
  const toTaskSummary: typeof import('../../server/utils/tasks').toTaskSummary
  const toUserSummary: typeof import('../../server/utils/auth').toUserSummary
  const toWebHandler: typeof import('../../node_modules/h3/dist/index').toWebHandler
  const toWebRequest: typeof import('../../node_modules/h3/dist/index').toWebRequest
  const tokenNeedsRenewal: typeof import('../../server/utils/session').tokenNeedsRenewal
  const tryCookieLocale: typeof import('../../node_modules/@intlify/utils/dist/h3').tryCookieLocale
  const tryHeaderLocale: typeof import('../../node_modules/@intlify/utils/dist/h3').tryHeaderLocale
  const tryHeaderLocales: typeof import('../../node_modules/@intlify/utils/dist/h3').tryHeaderLocales
  const tryPathLocale: typeof import('../../node_modules/@intlify/utils/dist/h3').tryPathLocale
  const tryQueryLocale: typeof import('../../node_modules/@intlify/utils/dist/h3').tryQueryLocale
  const unsealSession: typeof import('../../node_modules/h3/dist/index').unsealSession
  const updateSession: typeof import('../../node_modules/h3/dist/index').updateSession
  const useAppConfig: typeof import('../../node_modules/@nuxt/nitro-server/dist/runtime/utils/app-config').useAppConfig
  const useBase: typeof import('../../node_modules/h3/dist/index').useBase
  const useEvent: typeof import('../../node_modules/nitropack/dist/runtime/internal/context').useEvent
  const useNitroApp: typeof import('../../node_modules/nitropack/dist/runtime/internal/app').useNitroApp
  const usePrisma: typeof import('../../server/utils/db').usePrisma
  const useRuntimeConfig: typeof import('../../node_modules/nitropack/dist/runtime/internal/config').useRuntimeConfig
  const useSession: typeof import('../../node_modules/h3/dist/index').useSession
  const useStorage: typeof import('../../node_modules/nitropack/dist/runtime/internal/storage').useStorage
  const useTranslation: typeof import('../../node_modules/@intlify/h3').useTranslation
  const verifyOtpCode: typeof import('../../server/utils/crypto').verifyOtpCode
  const verifySessionToken: typeof import('../../server/utils/session').verifySessionToken
  const visibleMemberScope: typeof import('../../shared/utils/member-scope').visibleMemberScope
  const writeEarlyHints: typeof import('../../node_modules/h3/dist/index').writeEarlyHints
}
// for type re-export
declare global {
  // @ts-ignore
  export type { EventHandler, EventHandlerRequest, EventHandlerResponse, EventHandlerObject, H3EventContext } from '../../node_modules/h3/dist/index'
  import('../../node_modules/h3/dist/index')
  // @ts-ignore
  export type { ScopeSubject, MemberTarget, MemberPermissions } from '../../shared/utils/member-scope'
  import('../../shared/utils/member-scope')
  // @ts-ignore
  export type { Role, Permission } from '../../shared/utils/permissions'
  import('../../shared/utils/permissions')
  // @ts-ignore
  export type { TaskStatus, TaskPriority, ReviewDecision, TaskAction, TaskActorKind, TaskTransition, TaskActorContext, TransitionCheck } from '../../shared/utils/task'
  import('../../shared/utils/task')
  // @ts-ignore
  export type { LevelBoundary, LevelProgress } from '../../shared/utils/xp'
  import('../../shared/utils/xp')
  // @ts-ignore
  export type { ApiErrorBody, AuthContext, Paginated, MeResponse, CompanySummary, UserSummary, RequestOtpResponse, VerifyOtpResponse, OnboardingContext, CompleteOnboardingResponse, SlugAvailabilityResponse, InvitationStatus, TeamRole, UserStatus, MemberSummary, MemberListResponse, MemberDetail, MemberDetailResponse, InvitationSummary, InvitationListResponse, InvitationDetail, PendingInvitationResponse, TeamSummary, TeamDetail, TeamDetailResponse, AcceptInvitationResponse, TaskPerson, TaskComment, TaskAttachment, TaskReviewEntry, TaskEventEntry, TaskListResponse, TaskDetailResponse, TaskMutationResponse, TeamCompletionRow, TaskDashboardResponse } from '../../shared/types/api'
  import('../../shared/types/api')
  // @ts-ignore
  export type { SessionSubject, IssuedSession, UserRow, CompanyRow } from '../../server/utils/auth'
  import('../../server/utils/auth')
  // @ts-ignore
  export type { Validator } from '../../server/utils/http'
  import('../../server/utils/http')
  // @ts-ignore
  export type { InvitationTicket } from '../../server/utils/invitation'
  import('../../server/utils/invitation')
  // @ts-ignore
  export type { MemberRow } from '../../server/utils/members'
  import('../../server/utils/members')
  // @ts-ignore
  export type { OnboardingTicket } from '../../server/utils/onboarding'
  import('../../server/utils/onboarding')
  // @ts-ignore
  export type { OtpDeliveryError, OtpSendInput, OtpProvider } from '../../server/utils/otp'
  import('../../server/utils/otp')
  // @ts-ignore
  export type { SessionClaims } from '../../server/utils/session'
  import('../../server/utils/session')
  // @ts-ignore
  export type { TenantDb, TenantTx, TaskWriteClient, TaskRow, TaskSummary } from '../../server/utils/tasks'
  import('../../server/utils/tasks')
  // @ts-ignore
  export type { TenantModel, TenantClient } from '../../server/utils/tenant'
  import('../../server/utils/tenant')
}
export { H3Event, H3Error, appendCorsHeaders, appendCorsPreflightHeaders, appendHeader, appendHeaders, appendResponseHeader, appendResponseHeaders, assertMethod, callNodeListener, clearResponseHeaders, clearSession, createApp, createAppEventHandler, createError, createEvent, createEventStream, createRouter, defaultContentType, defineEventHandler, defineLazyEventHandler, defineNodeListener, defineNodeMiddleware, defineRequestMiddleware, defineResponseMiddleware, defineWebSocket, defineWebSocketHandler, deleteCookie, dynamicEventHandler, eventHandler, fetchWithEvent, fromNodeMiddleware, fromPlainHandler, fromWebHandler, getCookie, getHeader, getHeaders, getMethod, getProxyRequestHeaders, getQuery, getRequestFingerprint, getRequestHeader, getRequestHeaders, getRequestHost, getRequestIP, getRequestPath, getRequestProtocol, getRequestURL, getRequestWebStream, getResponseHeader, getResponseHeaders, getResponseStatus, getResponseStatusText, getRouterParam, getRouterParams, getSession, getValidatedQuery, getValidatedRouterParams, handleCacheHeaders, handleCors, isCorsOriginAllowed, isError, isEvent, isEventHandler, isMethod, isPreflightRequest, isStream, isWebResponse, lazyEventHandler, parseCookies, promisifyNodeListener, proxyRequest, readBody, readFormData, readMultipartFormData, readRawBody, readValidatedBody, removeResponseHeader, sanitizeStatusCode, sanitizeStatusMessage, sealSession, send, sendError, sendIterable, sendNoContent, sendProxy, sendRedirect, sendStream, sendWebResponse, serveStatic, setCookie, setHeader, setHeaders, setResponseHeader, setResponseHeaders, setResponseStatus, splitCookiesString, toEventHandler, toNodeListener, toPlainHandler, toWebHandler, toWebRequest, unsealSession, updateSession, useBase, useSession, writeEarlyHints } from 'h3';
export { useNitroApp } from 'nitropack/runtime/internal/app';
export { useRuntimeConfig } from 'nitropack/runtime/internal/config';
export { defineNitroPlugin, nitroPlugin } from 'nitropack/runtime/internal/plugin';
export { defineCachedFunction, defineCachedEventHandler, cachedFunction, cachedEventHandler } from 'nitropack/runtime/internal/cache';
export { useStorage } from 'nitropack/runtime/internal/storage';
export { defineRenderHandler } from 'nitropack/runtime/internal/renderer';
export { defineRouteMeta } from 'nitropack/runtime/internal/meta';
export { getRouteRules } from 'nitropack/runtime/internal/route-rules';
export { useEvent } from 'nitropack/runtime/internal/context';
export { defineTask, runTask } from 'nitropack/runtime/internal/task';
export { defineNitroErrorHandler } from 'nitropack/runtime/internal/error/utils';
export { buildAssetsURL as __buildAssetsURL, publicAssetsURL as __publicAssetsURL } from '/home/user/WorkQuest/node_modules/@nuxt/nitro-server/dist/runtime/utils/paths';
export { defineAppConfig } from '/home/user/WorkQuest/node_modules/@nuxt/nitro-server/dist/runtime/utils/config';
export { useAppConfig } from '/home/user/WorkQuest/node_modules/@nuxt/nitro-server/dist/runtime/utils/app-config';
export { defineI18nLocale, defineI18nConfig } from '/home/user/WorkQuest/node_modules/@nuxtjs/i18n/dist/runtime/composables/shared';
export { defineI18nLocaleDetector } from '/home/user/WorkQuest/node_modules/@nuxtjs/i18n/dist/runtime/composables/server';
export { useTranslation } from '@intlify/h3';
export { getCookieLocale, getHeaderLanguage, getHeaderLanguages, getHeaderLocale, getHeaderLocales, getPathLocale, getQueryLocale, setCookieLocale, tryCookieLocale, tryHeaderLocale, tryHeaderLocales, tryPathLocale, tryQueryLocale } from '@intlify/utils/h3';
export { numberLocale, formatNumber, formatCompactNumber, formatPercent, calendarLocale, formatDate, formatRelativeDate, normalizeIranianPhone, formatPhone, slugify } from '/home/user/WorkQuest/shared/utils/format';
export { visibleMemberScope, memberPermissions, canEditTeam, maxAssignableRole, roleAtMost, canLeadRole } from '/home/user/WorkQuest/shared/utils/member-scope';
export { ROLES, ROLE_RANK, PERMISSIONS, isRole, can, roleAtLeast } from '/home/user/WorkQuest/shared/utils/permissions';
export { TASK_STATUSES, TASK_PRIORITIES, REVIEW_DECISIONS, OPEN_TASK_STATUSES, ACTIVE_TASK_STATUSES, CLOSED_TASK_STATUSES, TASK_ACTIONS, TASK_TRANSITIONS, isTaskStatus, isTaskAction, findTransition, canTransition, nextStatus, checkTransition, availableActions, isOverdue, daysUntilDue, isDueToday, completionRate, PRIORITY_WEIGHT } from '/home/user/WorkQuest/shared/utils/task';
export { defaultMinXp, resolveLevel, computeLevelProgress, streakProgressPercent } from '/home/user/WorkQuest/shared/utils/xp';
export { getAuth, requireAuth, requirePermission, getManagedUserIds, resolveVisibleUserIds, issueSession, startSession, toUserSummary, toCompanySummary } from '/home/user/WorkQuest/server/utils/auth';
export { generateOtpCode, hashOtpCode, verifyOtpCode } from '/home/user/WorkQuest/server/utils/crypto';
export { databaseUrl, usePrisma, disconnectPrisma } from '/home/user/WorkQuest/server/utils/db';
export { default as errorHandler } from '/home/user/WorkQuest/server/utils/error-handler';
export { apiError, errors, readValidated, readValidatedQuery } from '/home/user/WorkQuest/server/utils/http';
export { issueInvitationTicket, readInvitationCookie, clearInvitationCookie, findInvitationTicket, requireInvitationTicket, consumeInvitationTicket, listPendingInvitationsForPhone, toInvitationDetail, expireStaleInvitations } from '/home/user/WorkQuest/server/utils/invitation';
export { MEMBER_SELECT, assertCanLead, rejectSecondMembership, ledTeamIds, teamDetail } from '/home/user/WorkQuest/server/utils/members';
export { issueOnboardingTicket, readOnboardingCookie, clearOnboardingCookie, findOnboardingTicket, requireOnboardingTicket, consumeOnboardingTicket, reserveCompanySlug, bootstrapCompanyDefaults } from '/home/user/WorkQuest/server/utils/onboarding';
export { OtpDeliveryError, consoleOtpProvider, httpOtpProvider, resolveOtpProvider, otpSettings } from '/home/user/WorkQuest/server/utils/otp';
export { signSessionToken, verifySessionToken, readSessionToken, setSessionCookie, clearSessionCookie, tokenNeedsRenewal } from '/home/user/WorkQuest/server/utils/session';
export { TASK_SELECT, toTaskSummary, taskVisibleUserIds, ledTeamIdsFor, loadVisibleTask, canManageTask, assertAssignable, assertUsableTeam, assertTransitionAllowed, recordTaskEvent, notifyTask } from '/home/user/WorkQuest/server/utils/tasks';
export { TENANT_MODELS, isTenantModel, createTenantClient } from '/home/user/WorkQuest/server/utils/tenant';