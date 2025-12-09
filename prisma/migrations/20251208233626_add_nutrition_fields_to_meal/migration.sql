/*
  Warnings:

  - You are about to drop the column `carbds` on the `Meal` table. All the data in the column will be lost.
  - Added the required column `carbs` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `calories` on the `Meal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `protein` on the `Meal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fat` on the `Meal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "carbds",
ADD COLUMN     "carbs" INTEGER NOT NULL,
DROP COLUMN "calories",
ADD COLUMN     "calories" INTEGER NOT NULL,
DROP COLUMN "protein",
ADD COLUMN     "protein" INTEGER NOT NULL,
DROP COLUMN "fat",
ADD COLUMN     "fat" INTEGER NOT NULL;
