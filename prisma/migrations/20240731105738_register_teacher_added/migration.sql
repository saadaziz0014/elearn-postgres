-- CreateEnum
CREATE TYPE "RegisterTeacherStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "RegisterTeacher" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "status" "RegisterTeacherStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegisterTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegisterTeacher_studentId_key" ON "RegisterTeacher"("studentId");

-- AddForeignKey
ALTER TABLE "RegisterTeacher" ADD CONSTRAINT "RegisterTeacher_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
