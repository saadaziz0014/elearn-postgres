/*
  Warnings:

  - Added the required column `experience` to the `RegisterTeacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization` to the `RegisterTeacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegisterTeacher" ADD COLUMN     "experience" INTEGER NOT NULL,
ADD COLUMN     "specialization" TEXT NOT NULL;
