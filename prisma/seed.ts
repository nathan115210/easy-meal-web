import 'dotenv/config';
import { prisma } from '@/utils/lib/prisma';

export async function main() {
  // 1) Simple Tomato Pasta
  await prisma.meal.create({
    data: {
      title: 'Simple Tomato Pasta',
      description:
        'Simple Tomato Pasta is a classic Italian dish featuring pasta tossed in a light, vibrant sauce made primarily from tomatoes, garlic, and olive oil.',
      image: '/images/meals/simple-tomato-pasta.jpg',
      mealType: ['dinner'],
      cookTime: 20,
      tags: ['quick', 'vegetarian', '30-minutes-or-less'],
      difficulty: 'easy',
      calories: 550,
      protein: 18,
      carbs: 75,
      fat: 16,
      ingredients: {
        create: [
          { text: 'Spaghetti', amount: '120 g' },
          { text: 'Olive oil', amount: '1 tbsp' },
          { text: 'Garlic cloves, minced', amount: '2' },
          { text: 'Canned chopped tomatoes', amount: '200 g' },
          { text: 'Salt', amount: 'to taste' },
          { text: 'Black pepper', amount: 'to taste' },
        ],
      },
      instructions: {
        create: [
          {
            step: 1,
            text: 'Cook spaghetti in salted boiling water until al dente. Reserve a little pasta water.',
            image: '',
          },
          {
            step: 2,
            text: 'In a pan, gently fry garlic in olive oil until fragrant, then add tomatoes and simmer 5–10 minutes.',
            image: '',
          },
          {
            step: 3,
            text: 'Toss pasta with sauce, using a splash of pasta water if needed. Season with salt and pepper.',
            image: '',
          },
        ],
      },
    },
  });

  // 2) Protein Scrambled Eggs Toast
  await prisma.meal.create({
    data: {
      title: 'Protein Scrambled Eggs on Toast',
      description:
        'A nutritious and satisfying breakfast that combines creamy, high-protein scrambled eggs served atop crisp, wholesome toast',
      image: '/images/meals/scrambled-eggs-toast.jpg',
      mealType: ['breakfast'],
      cookTime: 10,
      tags: ['high-protein', 'quick', 'breakfast'],
      difficulty: 'easy',
      calories: 430,
      protein: 28,
      carbs: 35,
      fat: 17,
      ingredients: {
        create: [
          { text: 'Eggs', amount: '3' },
          { text: 'Skim milk', amount: '30 ml' },
          { text: 'Wholegrain bread slices', amount: '2' },
          { text: 'Salt', amount: 'a pinch' },
          { text: 'Black pepper', amount: 'a pinch' },
        ],
      },
      instructions: {
        create: [
          {
            step: 1,
            text: 'Whisk eggs with milk, salt and pepper in a bowl.',
            image: '',
          },
          {
            step: 2,
            text: 'Toast the bread. Meanwhile, cook the eggs in a non-stick pan over low heat, stirring gently.',
            image: '',
          },
          {
            step: 3,
            text: 'Serve scrambled eggs on toast and season to taste.',
            image: '',
          },
        ],
      },
    },
  });

  console.log('Seed data inserted');
}

main()
  .catch((e) => {
    console.error('Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
