/*
  Warnings:

  - A unique constraint covering the columns `[mealId,step]` on the table `InstructionItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_mealId_fkey";

-- DropIndex
DROP INDEX "Ingredient_mealId_key";

-- CreateIndex
CREATE UNIQUE INDEX "InstructionItem_mealId_step_key" ON "InstructionItem"("mealId", "step");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
