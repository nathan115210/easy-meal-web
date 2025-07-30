import * as path from 'path';
import * as fs from 'fs';
import Database from 'better-sqlite3';
import type { Meal } from '@/types/meals';

const dir = 'database';
const dbPath = path.resolve(process.cwd(), 'database', 'meals.db');
// Create the database directory if it doesn't exist
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const db = new Database(dbPath, { verbose: console.log });

const dummyMeals: Meal[] = [
  {
    title: 'Juicy Cheese Burger',
    slug: 'juicy-cheese-burger',
    image: '/meals/burger.png',
    description: 'A mouth-watering burger with a juicy beef patty and melted cheese, served in a soft bun.',
    ingredients: [
      { text: 'Ground beef', amount: '200g' },
      { text: 'Salt', amount: 'to taste' },
      { text: 'Pepper', amount: 'to taste' },
      { text: 'Burger bun', amount: '1' },
      { text: 'Lettuce', amount: '1 leaf' },
      { text: 'Tomato', amount: '2 slices' },
      { text: 'Cheese slice', amount: '1' },
      { text: 'Oil', amount: '1 tbsp' },
    ],
    instructions: [
      {
        image: '/meal-placeholder.png',
        text: 'Prepare the patty: Mix 200g of ground beef with salt and pepper. Form into a patty.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Cook the patty: Heat a pan with a bit of oil. Cook the patty for 2-3 minutes each side, until browned.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Assemble the burger: Toast the burger bun halves. Place lettuce and tomato on the bottom half. Add the cooked patty and top with a slice of cheese.',
      },
      { image: '/meal-placeholder.png', text: 'Serve: Complete the assembly with the top bun and serve hot.' },
    ],
    creator: 'John Doe',
    creator_email: 'johndoe@example.com',
  },
  {
    title: 'Spicy Curry',
    slug: 'spicy-curry',
    image: '/meals/curry.png',
    description: 'A rich and spicy curry, infused with exotic spices and creamy coconut milk.',
    ingredients: [
      { text: 'Mixed vegetables', amount: '400g' },
      { text: 'Curry paste', amount: '2 tbsp' },
      { text: 'Coconut milk', amount: '500ml' },
      { text: 'Oil', amount: '2 tbsp' },
      { text: 'Salt', amount: 'to taste' },
      { text: 'Pepper', amount: 'to taste' },
    ],
    instructions: [
      {
        image: '/meal-placeholder.png',
        text: 'Chop vegetables: Cut your choice of vegetables into bite-sized pieces.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Sauté vegetables: In a pan with oil, sauté the vegetables until they start to soften.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Add curry paste: Stir in 2 tablespoons of curry paste and cook for another minute.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Simmer with coconut milk: Pour in 500ml of coconut milk and bring to a simmer. Let it cook for about 15 minutes.',
      },
      { image: '/meal-placeholder.png', text: 'Serve: Enjoy this creamy curry with rice or bread.' },
    ],
    creator: 'Max Schwarz',
    creator_email: 'max@example.com',
  },
  {
    title: 'Homemade Dumplings',
    slug: 'homemade-dumplings',
    image: '/meals/dumplings.png',
    description: 'Tender dumplings filled with savory meat and vegetables, steamed to perfection.',
    ingredients: [
      { text: 'Minced meat', amount: '200g' },
      { text: 'Shredded vegetables', amount: '100g' },
      { text: 'Spices', amount: '1 tsp' },
      { text: 'Dumpling wrappers', amount: '12' },
    ],
    instructions: [
      {
        image: '/meal-placeholder.png',
        text: 'Prepare the filling: Mix minced meat, shredded vegetables, and spices.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Fill the dumplings: Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Steam the dumplings: Arrange dumplings in a steamer. Steam for about 10 minutes.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Serve: Enjoy these dumplings hot, with a dipping sauce of your choice.',
      },
    ],
    creator: 'Emily Chen',
    creator_email: 'emilychen@example.com',
  },
  {
    title: 'Classic Mac n Cheese',
    slug: 'classic-mac-n-cheese',
    image: '/meals/macncheese.png',
    description: "Creamy and cheesy macaroni, a comforting classic that's always a crowd-pleaser.",
    ingredients: [
      { text: 'Macaroni', amount: '250g' },
      { text: 'Butter', amount: '2 tbsp' },
      { text: 'Flour', amount: '2 tbsp' },
      { text: 'Milk', amount: '400ml' },
      { text: 'Grated cheese', amount: '150g' },
      { text: 'Breadcrumbs', amount: '30g' },
      { text: 'Parsley', amount: '1 tbsp (optional)' },
    ],
    instructions: [
      {
        image: '/meal-placeholder.png',
        text: 'Prepare the filling: Mix minced meat, shredded vegetables, and spices.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Fill the dumplings: Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Steam the dumplings: Arrange dumplings in a steamer. Steam for about 10 minutes.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Serve: Enjoy these dumplings hot, with a dipping sauce of your choice.',
      },
    ],
    creator: 'Laura Smith',
    creator_email: 'laurasmith@example.com',
  },
  {
    title: 'Authentic Pizza',
    slug: 'authentic-pizza',
    image: '/meals/pizza.png',
    description: 'Hand-tossed pizza with a tangy tomato sauce, fresh toppings, and melted cheese.',
    ingredients: [
      { text: 'Pizza dough', amount: '1 ball' },
      { text: 'Tomato sauce', amount: '100g' },
      { text: 'Cheese', amount: '100g' },
      { text: 'Favorite toppings', amount: 'as desired' },
      { text: 'Basil leaves', amount: 'a few' },
    ],
    instructions: [
      {
        image: '/meal-placeholder.png',
        text: 'Prepare the filling: Mix minced meat, shredded vegetables, and spices.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Fill the dumplings: Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Steam the dumplings: Arrange dumplings in a steamer. Steam for about 10 minutes.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Serve: Enjoy these dumplings hot, with a dipping sauce of your choice.',
      },
    ],
    creator: 'Mario Rossi',
    creator_email: 'mariorossi@example.com',
  },
  {
    title: 'Wiener Schnitzel',
    slug: 'wiener-schnitzel',
    image: '/meals/schnitzel.png',
    description: 'Crispy, golden-brown breaded veal cutlet, a classic Austrian dish.',
    ingredients: [
      { text: 'Veal cutlets', amount: '2' },
      { text: 'Flour', amount: '50g' },
      { text: 'Eggs', amount: '2' },
      { text: 'Breadcrumbs', amount: '100g' },
      { text: 'Oil', amount: 'for frying' },
      { text: 'Lemon', amount: '1 slice' },
      { text: 'Potato salad', amount: '1 serving' },
      { text: 'Greens', amount: '1 serving' },
    ],
    instructions: [
      {
        image: '/meal-placeholder.png',
        text: 'Prepare the filling: Mix minced meat, shredded vegetables, and spices.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Fill the dumplings: Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Steam the dumplings: Arrange dumplings in a steamer. Steam for about 10 minutes.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Serve: Enjoy these dumplings hot, with a dipping sauce of your choice.',
      },
    ],
    creator: 'Franz Huber',
    creator_email: 'franzhuber@example.com',
  },
  {
    title: 'Fresh Tomato Salad',
    slug: 'fresh-tomato-salad',
    image: '/meals/tomato-salad.png',
    description: 'A light and refreshing salad with ripe tomatoes, fresh basil, and a tangy vinaigrette.',
    ingredients: [
      { text: 'Fresh tomatoes', amount: '2' },
      { text: 'Basil', amount: 'a handful' },
      { text: 'Salt', amount: 'to taste' },
      { text: 'Pepper', amount: 'to taste' },
      { text: 'Olive oil', amount: '2 tbsp' },
      { text: 'Balsamic vinegar', amount: '1 tbsp' },
    ],
    instructions: [
      {
        image: '/meal-placeholder.png',
        text: 'Prepare the filling: Mix minced meat, shredded vegetables, and spices.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Fill the dumplings: Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Steam the dumplings: Arrange dumplings in a steamer. Steam for about 10 minutes.',
      },
      {
        image: '/meal-placeholder.png',
        text: 'Serve: Enjoy these dumplings hot, with a dipping sauce of your choice.',
      },
    ],
    creator: 'Sophia Green',
    creator_email: 'sophiagreen@example.com',
  },
];

// language=SQL format=false
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS meals
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    creator TEXT NOT NULL,
    creator_email TEXT NOT NULL
  )
`
).run();

async function initData() {
  const stmt = db.prepare(`
    INSERT INTO meals (slug,
                       title,
                       image,
                       description,
                       ingredients,
                       instructions,
                       creator,
                       creator_email)
    VALUES (@slug,
            @title,
            @image,
            @description,
            @ingredients,
            @instructions,
            @creator,
            @creator_email)
  `);
  for (const meal of dummyMeals) {
    stmt.run({
      ...meal,
      ingredients: JSON.stringify(meal.ingredients),
      instructions: JSON.stringify(meal.instructions),
    });
  }
}

initData();
