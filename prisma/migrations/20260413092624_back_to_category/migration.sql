/*
  Warnings:

  - You are about to drop the column `categorySlug` on the `Annonce` table. All the data in the column will be lost.
  - Added the required column `categorieId` to the `Annonce` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Annonce_categorySlug_idx";

-- AlterTable
ALTER TABLE "Annonce" DROP COLUMN "categorySlug",
ADD COLUMN     "categorieId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Annonce_categorieId_idx" ON "Annonce"("categorieId");

-- AddForeignKey
ALTER TABLE "Annonce" ADD CONSTRAINT "Annonce_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
