/*
  Warnings:

  - You are about to drop the column `subcategoryId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `subcategories` table. All the data in the column will be lost.
  - Added the required column `subcategory_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "subcategories" DROP CONSTRAINT "subcategories_categoryId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "subcategoryId",
ADD COLUMN     "subcategory_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subcategories" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "category_subcategories" (
    "category_id" INTEGER NOT NULL,
    "subcategory_id" INTEGER NOT NULL,

    CONSTRAINT "category_subcategories_pkey" PRIMARY KEY ("category_id","subcategory_id")
);

-- AddForeignKey
ALTER TABLE "category_subcategories" ADD CONSTRAINT "category_subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_subcategories" ADD CONSTRAINT "category_subcategories_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
