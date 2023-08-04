/*
  Warnings:

  - Added the required column `publishDate` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publisher` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "publishDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "publisher" TEXT NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0;
