/*
  Warnings:

  - Made the column `title` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "title" SET NOT NULL;
