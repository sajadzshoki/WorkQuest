import type { Role } from './permissions'

import { can, ROLE_RANK } from './permissions'

/**
 * Scope rules for people and teams.
 *
 * The permission matrix answers "may this role act at all"; the helpers here
 * answer "on which rows". They are pure on purpose: they take the caller's
 * context and the ids already fetched, so the whole security model is testable
 * without a database and cannot drift from the server's behaviour.
 *
 * OWNER and ADMIN are company-wide. MANAGER is limited to their own team plus
 * their transitive reports. EMPLOYEE sees nobody but themselves.
 */

/** Minimal shape of the caller needed to decide scope. */
export interface ScopeSubject {
  userId: string
  role: Role
}

/** Minimal shape of a member being acted on. */
export interface MemberTarget {
  id: string
  role: Role
  status: string
}

export interface MemberPermissions {
  canEdit: boolean
  canChangeRole: boolean
  canRemove: boolean
}

/**
 * User ids the caller may *read*. `null` means "the whole company".
 *
 * @param managedUserIds the caller's transitive reports, as walked from
 *   `TeamMember.managerId`. Ignored for OWNER/ADMIN, who see everyone.
 */
export function visibleMemberScope(
  subject: ScopeSubject,
  managedUserIds: string[],
): string[] | null {
  // OWNER / ADMIN — company-wide.
  if (can(subject.role, 'member:manage')) return null
  // MANAGER — self plus transitive reports.
  if (can(subject.role, 'member:read')) {
    return [...new Set([subject.userId, ...managedUserIds])]
  }
  // EMPLOYEE — self only.
  return [subject.userId]
}

/**
 * Whether the caller may act on a specific member.
 *
 * OWNER/ADMIN: everyone, except that they may not change their **own** role
 * (that would let an admin lock themselves out) and may never change an
 * OWNER's role at all — transferring ownership is a separate, deliberate
 * action this API does not offer.
 *
 * MANAGER: their reports only, and never a role change or a removal.
 *
 * EMPLOYEE: nobody, including themselves.
 */
export function memberPermissions(
  subject: ScopeSubject,
  target: MemberTarget,
  managedUserIds: string[],
): MemberPermissions {
  const isSelf = target.id === subject.userId

  if (can(subject.role, 'member:manage')) {
    return {
      canEdit: !isSelf,
      canChangeRole: !isSelf && target.role !== 'OWNER',
      canRemove: !isSelf && target.role !== 'OWNER',
    }
  }

  if (can(subject.role, 'member:read') && managedUserIds.includes(target.id)) {
    return { canEdit: true, canChangeRole: false, canRemove: false }
  }

  return { canEdit: false, canChangeRole: false, canRemove: false }
}

/**
 * Can the caller edit this team?
 *
 * OWNER/ADMIN: any team. MANAGER: only the ones they lead. EMPLOYEE: none —
 * and note that a lead always holds at least the MANAGER role (see
 * `canLeadRole`), so "EMPLOYEE lead" is not a state the system can be in.
 *
 * @param ledTeamIds ids of teams whose `leadId` is the caller.
 */
export function canEditTeam(
  subject: ScopeSubject,
  teamId: string,
  ledTeamIds: string[],
): boolean {
  if (can(subject.role, 'team:manage')) return true
  if (can(subject.role, 'team:manage:assigned')) return ledTeamIds.includes(teamId)
  return false
}

/** The highest role a caller may grant to someone else. */
export function maxAssignableRole(role: Role): Role {
  if (role === 'OWNER' || role === 'ADMIN') return 'ADMIN'
  return 'EMPLOYEE'
}

export function roleAtMost(role: Role, max: Role): boolean {
  return ROLE_RANK[role] <= ROLE_RANK[max]
}

/**
 * Whether a company role is high enough to lead a team.
 *
 * Team-management scope comes from `team:manage:assigned`, which the matrix
 * grants to MANAGER and above — so appointing an EMPLOYEE would create a
 * "lead" who can see the roster but change nothing. Refusing the appointment
 * is clearer than that, and it keeps promotion an explicit, auditable step.
 */
export function canLeadRole(role: Role): boolean {
  return role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER'
}
