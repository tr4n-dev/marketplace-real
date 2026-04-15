/*
  Warnings:

  - You are about to drop the column `categorieId` on the `Annonce` table. All the data in the column will be lost.
  - Added the required column `categorySlug` to the `Annonce` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Annonce" DROP CONSTRAINT "Annonce_categorieId_fkey";

-- DropIndex
DROP INDEX "Annonce_categorieId_idx";

-- AlterTable
ALTER TABLE "Annonce" DROP COLUMN "categorieId",
ADD COLUMN     "categorySlug" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Annonce_categorySlug_idx" ON "Annonce"("categorySlug");
