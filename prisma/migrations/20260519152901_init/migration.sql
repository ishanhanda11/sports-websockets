-- AlterTable
ALTER TABLE "matches" ALTER COLUMN "status" SET DEFAULT 'scheduled',
ALTER COLUMN "end_time" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "commentary_match_id_idx" ON "commentary"("match_id");

-- CreateIndex
CREATE INDEX "matches_status_idx" ON "matches"("status");

-- CreateIndex
CREATE INDEX "matches_sport_idx" ON "matches"("sport");
