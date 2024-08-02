/*
  Warnings:

  - Added the required column `evidence` to the `CourseCompletionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseCompletionRequest" ADD COLUMN     "evidence" TEXT NOT NULL;
