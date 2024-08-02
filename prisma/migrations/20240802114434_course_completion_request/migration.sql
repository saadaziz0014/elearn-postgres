-- CreateTable
CREATE TABLE "CourseCompletionRequest" (
    "id" SERIAL NOT NULL,
    "studentCourseId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseCompletionRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseCompletionRequest" ADD CONSTRAINT "CourseCompletionRequest_studentCourseId_fkey" FOREIGN KEY ("studentCourseId") REFERENCES "StudentCourses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
