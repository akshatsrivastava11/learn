/*
  Warnings:

  - You are about to drop the column `flashcards` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "flashcards";

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "Quesn" TEXT NOT NULL,
    "Ans" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
