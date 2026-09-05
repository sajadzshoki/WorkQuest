-- Windowed leaderboards.
--
-- The boards rank a *period*: every XP row and every achievement unlock that
-- falls inside a calendar week or month in the company timezone. Both queries
-- are company-wide and time-bounded, which the existing indexes (leading with
-- companyId + userId) cannot serve without scanning a person at a time.
--
-- No table is added and nothing is backfilled: a leaderboard period is derived
-- from the immutable ledgers, so "resetting" a board is the window moving
-- forward, not a DELETE. XP, coins, levels and achievements are untouched.

CREATE INDEX "XpTransaction_companyId_createdAt_idx" ON "XpTransaction"("companyId", "createdAt");

CREATE INDEX "UserAchievement_companyId_unlockedAt_idx" ON "UserAchievement"("companyId", "unlockedAt");
