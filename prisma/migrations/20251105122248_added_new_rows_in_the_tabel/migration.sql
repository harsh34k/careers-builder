/*
  Warnings:

  - You are about to drop the column `jobType` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `workType` on the `Job` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "work_policy" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "employment_type" AS ENUM ('FULLTIME', 'PARTTIME', 'CONTRACT');

-- CreateEnum
CREATE TYPE "experience_level" AS ENUM ('SENIOR', 'MIDLEVEL', 'JUNIOR');

-- CreateEnum
CREATE TYPE "job_type" AS ENUM ('TEMPORARY', 'PERMANENT', 'INTERNSHIP');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "jobType",
DROP COLUMN "workType",
ADD COLUMN     "employment_type" "employment_type" NOT NULL DEFAULT 'FULLTIME',
ADD COLUMN     "experience_level" "experience_level" NOT NULL DEFAULT 'JUNIOR',
ADD COLUMN     "job_type" "job_type" NOT NULL DEFAULT 'PERMANENT',
ADD COLUMN     "salary_range" TEXT,
ADD COLUMN     "work_policy" "work_policy" NOT NULL DEFAULT 'ONSITE';
