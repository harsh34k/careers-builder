/*
  Warnings:

  - Made the column `location` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `work_policy` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `employment_type` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `department` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `experience_level` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `job_type` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `salary_range` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "location" SET NOT NULL,
DROP COLUMN "work_policy",
ADD COLUMN     "work_policy" TEXT NOT NULL,
DROP COLUMN "employment_type",
ADD COLUMN     "employment_type" TEXT NOT NULL,
ALTER COLUMN "department" SET NOT NULL,
DROP COLUMN "experience_level",
ADD COLUMN     "experience_level" TEXT NOT NULL,
DROP COLUMN "job_type",
ADD COLUMN     "job_type" TEXT NOT NULL,
ALTER COLUMN "salary_range" SET NOT NULL;

-- DropEnum
DROP TYPE "public"."employment_type";

-- DropEnum
DROP TYPE "public"."experience_level";

-- DropEnum
DROP TYPE "public"."job_type";

-- DropEnum
DROP TYPE "public"."work_policy";
