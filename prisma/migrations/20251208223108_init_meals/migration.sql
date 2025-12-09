-- CreateTable
CREATE TABLE "Meal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "cookTime" INTEGER NOT NULL,
    "tags" TEXT[],
    "difficulty" TEXT NOT NULL,
    "calories" TEXT NOT NULL,
    "protein" TEXT NOT NULL,
    "carbds" TEXT NOT NULL,
    "fat" TEXT NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "mealId" INTEGER NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructionItem" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "text" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "mealId" INTEGER NOT NULL,

    CONSTRAINT "InstructionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_mealId_key" ON "Ingredient"("mealId");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructionItem" ADD CONSTRAINT "InstructionItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
