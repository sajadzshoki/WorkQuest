import { describe, expect, it } from 'vitest'

import {
  ACTIVE_TASK_STATUSES,
  CLOSED_TASK_STATUSES,
  OPEN_TASK_STATUSES,
  TASK_ACTIONS,
  TASK_STATUSES,
  availableActions,
  canTransition,
  checkTransition,
  completionRate,
  daysUntilDue,
  isDueToday,
  isOverdue,
  nextStatus,
} from '#shared/utils/task'

/**
 * The lifecycle rules are the security boundary for tasks: every mutation
 * endpoint delegates to `checkTransition`, so anything these tests permit, the
 * API permits. They are written against the *rules*, not against an
 * implementation detail, and they cover the seven scenarios the spec calls out.
 */

const ASSIGNEE = { isAssignee: true, canReview: false }
const OTHER_EMPLOYEE = { isAssignee: false, canReview: false }
const REVIEWER = { isAssignee: false, canReview: true }
/** A manager who assigned a task to themselves — allowed to work, not to grade. */
const SELF_MANAGING = { isAssignee: true, canReview: true }

describe('lifecycle: the happy path', () => {
  it('walks TODO → IN_PROGRESS → SUBMITTED → APPROVED', () => {
    expect(nextStatus('TODO', 'start')).toBe('IN_PROGRESS')
    expect(nextStatus('IN_PROGRESS', 'submit')).toBe('SUBMITTED')
    expect(nextStatus('SUBMITTED', 'approve')).toBe('APPROVED')
  })

  it('walks the rework loop SUBMITTED → NEEDS_REVISION → IN_PROGRESS → SUBMITTED', () => {
    expect(nextStatus('SUBMITTED', 'request_revision')).toBe('NEEDS_REVISION')
    expect(nextStatus('NEEDS_REVISION', 'start')).toBe('IN_PROGRESS')
    expect(nextStatus('IN_PROGRESS', 'submit')).toBe('SUBMITTED')
  })

  it('treats APPROVED as terminal', () => {
    for (const action of TASK_ACTIONS) {
      expect(canTransition('APPROVED', action)).toBe(false)
    }
  })
})

describe('starting a task', () => {
  it('lets the assignee start work they have been given', () => {
    expect(checkTransition('TODO', 'start', ASSIGNEE)).toEqual({ allowed: true })
  })

  it('lets the assignee pick the work back up after a revision request', () => {
    expect(checkTransition('NEEDS_REVISION', 'start', ASSIGNEE)).toEqual({ allowed: true })
  })

  it('refuses anyone who is not the assignee — including a manager', () => {
    expect(checkTransition('TODO', 'start', OTHER_EMPLOYEE).reason).toBe('NOT_ASSIGNEE')
    expect(checkTransition('TODO', 'start', REVIEWER).reason).toBe('NOT_ASSIGNEE')
  })

  it('refuses a task that is already in progress', () => {
    expect(checkTransition('IN_PROGRESS', 'start', ASSIGNEE).reason).toBe('INVALID_TRANSITION')
  })
})

describe('submitting a task', () => {
  it('lets the assignee submit work in progress', () => {
    expect(checkTransition('IN_PROGRESS', 'submit', ASSIGNEE)).toEqual({ allowed: true })
  })

  it('refuses a submission straight from TODO — work has to be started first', () => {
    expect(checkTransition('TODO', 'submit', ASSIGNEE).reason).toBe('INVALID_TRANSITION')
  })

  it('refuses a submission by someone else on the assignee’s behalf', () => {
    expect(checkTransition('IN_PROGRESS', 'submit', REVIEWER).reason).toBe('NOT_ASSIGNEE')
  })

  it('refuses a second submission of the same work', () => {
    expect(checkTransition('SUBMITTED', 'submit', ASSIGNEE).reason).toBe('INVALID_TRANSITION')
  })
})

describe('requesting a revision', () => {
  it('lets a reviewer send a submission back', () => {
    expect(checkTransition('SUBMITTED', 'request_revision', REVIEWER)).toEqual({ allowed: true })
  })

  it('refuses a revision request on work that was never submitted', () => {
    expect(checkTransition('IN_PROGRESS', 'request_revision', REVIEWER).reason)
      .toBe('INVALID_TRANSITION')
  })

  it('refuses an employee acting as a reviewer', () => {
    expect(checkTransition('SUBMITTED', 'request_revision', OTHER_EMPLOYEE).reason)
      .toBe('NOT_REVIEWER')
  })
})

describe('approving a task', () => {
  it('lets a reviewer approve someone else’s submission', () => {
    expect(checkTransition('SUBMITTED', 'approve', REVIEWER)).toEqual({ allowed: true })
  })

  it('refuses an employee approving their own task', () => {
    expect(checkTransition('SUBMITTED', 'approve', ASSIGNEE).reason).toBe('NOT_REVIEWER')
  })

  it('refuses an employee approving a colleague’s task', () => {
    expect(checkTransition('SUBMITTED', 'approve', OTHER_EMPLOYEE).reason).toBe('NOT_REVIEWER')
  })

  /**
   * The rule the spec states outright, and the one most easily lost: holding
   * the reviewer role is not enough — a manager who assigned work to themselves
   * still cannot sign it off.
   */
  it('refuses a MANAGER approving a task assigned to themselves', () => {
    expect(checkTransition('SUBMITTED', 'approve', SELF_MANAGING).reason).toBe('SELF_REVIEW')
    expect(checkTransition('SUBMITTED', 'request_revision', SELF_MANAGING).reason)
      .toBe('SELF_REVIEW')
  })

  it('refuses approving work that has not been submitted', () => {
    expect(checkTransition('TODO', 'approve', REVIEWER).reason).toBe('INVALID_TRANSITION')
    expect(checkTransition('IN_PROGRESS', 'approve', REVIEWER).reason).toBe('INVALID_TRANSITION')
    expect(checkTransition('NEEDS_REVISION', 'approve', REVIEWER).reason).toBe('INVALID_TRANSITION')
  })
})

describe('unauthorized updates', () => {
  it('gives an unrelated employee no actions at all, in any state', () => {
    for (const status of TASK_STATUSES) {
      expect(availableActions(status, OTHER_EMPLOYEE)).toEqual([])
    }
  })

  it('never lets an assignee reach a reviewer-only action', () => {
    for (const status of TASK_STATUSES) {
      const actions = availableActions(status, ASSIGNEE)
      expect(actions).not.toContain('approve')
      expect(actions).not.toContain('request_revision')
      expect(actions).not.toContain('reopen')
    }
  })

  it('never lets a reviewer do the assignee’s work for them', () => {
    for (const status of TASK_STATUSES) {
      const actions = availableActions(status, REVIEWER)
      expect(actions).not.toContain('start')
      expect(actions).not.toContain('submit')
    }
  })

  it('rejects an unknown action', () => {
    expect(checkTransition('TODO', 'destroy' as never, REVIEWER).reason).toBe('UNKNOWN_ACTION')
  })
})

describe('available actions drive the UI', () => {
  it('offers the assignee exactly one move per state', () => {
    expect(availableActions('TODO', ASSIGNEE)).toEqual(['start'])
    expect(availableActions('IN_PROGRESS', ASSIGNEE)).toEqual(['submit'])
    expect(availableActions('NEEDS_REVISION', ASSIGNEE)).toEqual(['start'])
    expect(availableActions('SUBMITTED', ASSIGNEE)).toEqual([])
  })

  it('offers a reviewer the three review moves on a submission', () => {
    expect(availableActions('SUBMITTED', REVIEWER).sort())
      .toEqual(['approve', 'reopen', 'request_revision'])
  })

  it('offers a self-managing manager only their assignee moves', () => {
    expect(availableActions('SUBMITTED', SELF_MANAGING)).toEqual([])
    expect(availableActions('TODO', SELF_MANAGING)).toEqual(['start'])
  })
})

describe('status groupings', () => {
  it('partitions every status into exactly one of open or closed', () => {
    for (const status of TASK_STATUSES) {
      const open = OPEN_TASK_STATUSES.includes(status)
      const closed = CLOSED_TASK_STATUSES.includes(status)
      // SUBMITTED is neither: the work is done but not accepted.
      expect(open && closed).toBe(false)
    }
    expect(CLOSED_TASK_STATUSES).toEqual(['APPROVED'])
  })

  it('counts only states the employee is working through as active', () => {
    expect(ACTIVE_TASK_STATUSES).toEqual(['IN_PROGRESS', 'NEEDS_REVISION'])
  })
})

describe('overdue calculation', () => {
  const now = new Date('2026-03-10T09:00:00Z')

  it('is false without a due date', () => {
    expect(isOverdue({ status: 'IN_PROGRESS', dueDate: null }, now)).toBe(false)
  })

  it('is true for open work whose due date has passed', () => {
    expect(isOverdue({ status: 'TODO', dueDate: '2026-03-09T09:00:00Z' }, now)).toBe(true)
    expect(isOverdue({ status: 'IN_PROGRESS', dueDate: '2026-03-09T09:00:00Z' }, now)).toBe(true)
    expect(isOverdue({ status: 'NEEDS_REVISION', dueDate: '2026-03-09T09:00:00Z' }, now)).toBe(true)
  })

  /** Still waiting on a reviewer, so the clock keeps running. */
  it('is true for a submission whose due date has passed', () => {
    expect(isOverdue({ status: 'SUBMITTED', dueDate: '2026-03-09T09:00:00Z' }, now)).toBe(true)
  })

  /** Finished work is never flagged, however late it was. */
  it('is false for approved work, even long past its due date', () => {
    expect(isOverdue({ status: 'APPROVED', dueDate: '2020-01-01T00:00:00Z' }, now)).toBe(false)
  })

  it('is false for work due in the future', () => {
    expect(isOverdue({ status: 'IN_PROGRESS', dueDate: '2026-03-11T09:00:00Z' }, now)).toBe(false)
  })

  it('is exclusive at the boundary — due exactly now is not yet late', () => {
    expect(isOverdue({ status: 'IN_PROGRESS', dueDate: now.toISOString() }, now)).toBe(false)
  })
})

describe('days until due', () => {
  /** 12:00 UTC is 15:30 in Tehran, comfortably inside the same calendar day. */
  const now = new Date('2026-03-10T12:00:00Z')

  it('returns null without a due date', () => {
    expect(daysUntilDue(null, now)).toBeNull()
  })

  it('counts calendar days, not 24-hour blocks', () => {
    // 21:00 UTC on the 10th is 00:30 on the 11th in Tehran — one day away,
    // even though it is only nine hours later.
    expect(daysUntilDue('2026-03-10T21:00:00Z', now, 'Asia/Tehran')).toBe(1)
    // Nine hours *earlier* on the same Tehran day is still zero.
    expect(daysUntilDue('2026-03-10T03:00:00Z', now, 'Asia/Tehran')).toBe(0)
  })

  it('returns 0 for today and negative for the past', () => {
    expect(daysUntilDue('2026-03-10T06:00:00Z', now, 'Asia/Tehran')).toBe(0)
    expect(daysUntilDue('2026-03-07T12:00:00Z', now, 'Asia/Tehran')).toBe(-3)
    expect(daysUntilDue('2026-03-15T12:00:00Z', now, 'Asia/Tehran')).toBe(5)
  })

  it('answers isDueToday consistently with daysUntilDue', () => {
    expect(isDueToday('2026-03-10T06:00:00Z', now, 'Asia/Tehran')).toBe(true)
    expect(isDueToday('2026-03-11T06:00:00Z', now, 'Asia/Tehran')).toBe(false)
    expect(isDueToday(null, now)).toBe(false)
  })

  it('respects the tenant timezone', () => {
    // 22:00 UTC on the 10th: still the 10th in UTC, already the 11th in Tehran.
    expect(daysUntilDue('2026-03-10T22:00:00Z', now, 'UTC')).toBe(0)
    expect(daysUntilDue('2026-03-10T22:00:00Z', now, 'Asia/Tehran')).toBe(1)
  })
})

describe('completion rate', () => {
  it('is a rounded percentage', () => {
    expect(completionRate(1, 3)).toBe(33)
    expect(completionRate(2, 3)).toBe(67)
    expect(completionRate(7, 10)).toBe(70)
  })

  it('is 0 rather than NaN for a team with no tasks', () => {
    expect(completionRate(0, 0)).toBe(0)
    expect(completionRate(5, 0)).toBe(0)
  })

  it('is 100 when everything is approved', () => {
    expect(completionRate(9, 9)).toBe(100)
  })
})
