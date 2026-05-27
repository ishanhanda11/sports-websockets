/*
  Warnings:

  - Made the column `end_time` on table `matches` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "matches" ALTER COLUMN "end_time" SET NOT NULL;
