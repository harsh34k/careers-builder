-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "work_policy" "work_policy" NOT NULL DEFAULT 'ONSITE',
    "employment_type" "employment_type" NOT NULL DEFAULT 'FULLTIME',
    "department" TEXT,
    "experience_level" "experience_level" NOT NULL DEFAULT 'JUNIOR',
    "job_type" "job_type" NOT NULL DEFAULT 'PERMANENT',
    "salary_range" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
