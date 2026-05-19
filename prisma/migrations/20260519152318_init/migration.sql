-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('scheduled', 'live', 'finished');

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "home_team" TEXT NOT NULL,
    "away_team" TEXT NOT NULL,
    "status" "MatchStatus" NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "home_score" INTEGER NOT NULL DEFAULT 0,
    "away_score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentary" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "commentary" ADD CONSTRAINT "commentary_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
