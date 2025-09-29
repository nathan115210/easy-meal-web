import * as path from 'path';
import * as fs from 'fs';
import Database from 'better-sqlite3';
import type { Meal } from '@/types/meals';

const dir = 'database';
const dbPath = path.resolve(process.cwd(), 'database', 'meals.db');
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
        text: 'Assemble the burger: Toast the bun. Add lettuce, tomato, patty, cheese.',
      },
      { image: '/meal-placeholder.png', text: 'Serve: Add top bun and serve hot.' },
    ],
    creator: 'John Doe',
    creator_email: 'johndoe@example.com',
    category: ['cheese'],
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
      { image: '/meal-placeholder.png', text: 'Chop vegetables.' },
      { image: '/meal-placeholder.png', text: 'Sauté vegetables in oil.' },
      { image: '/meal-placeholder.png', text: 'Add curry paste and cook 1 min.' },
      { image: '/meal-placeholder.png', text: 'Simmer with coconut milk ~15 min.' },
      { image: '/meal-placeholder.png', text: 'Serve with rice.' },
    ],
    creator: 'Max Schwarz',
    creator_email: 'max@example.com',
    category: ['cheese'],
  },
  {
    title: 'Homemade Dumplings',
    slug: 'homemade-dumplings',
    image: '/meals/dumplings.png',
    description: 'Tender dumplings with savory filling, steamed to perfection.',
    ingredients: [
      { text: 'Minced meat', amount: '200g' },
      { text: 'Shredded vegetables', amount: '100g' },
      { text: 'Spices', amount: '1 tsp' },
      { text: 'Dumpling wrappers', amount: '12' },
    ],
    instructions: [
      { image: '/meal-placeholder.png', text: 'Mix filling.' },
      { image: '/meal-placeholder.png', text: 'Fill and seal wrappers.' },
      { image: '/meal-placeholder.png', text: 'Steam ~10 min.' },
      { image: '/meal-placeholder.png', text: 'Serve hot.' },
    ],
    creator: 'Emily Chen',
    creator_email: 'emilychen@example.com',
    category: ['cheese'],
  },
  {
    title: 'Classic Mac n Cheese',
    slug: 'classic-mac-n-cheese',
    image: '/meals/macncheese.png',
    description: 'Creamy cheesy macaroni comfort dish.',
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
      { image: '/meal-placeholder.png', text: 'Cook pasta.' },
      { image: '/meal-placeholder.png', text: 'Make roux with butter+flour, add milk.' },
      { image: '/meal-placeholder.png', text: 'Melt in cheese, combine pasta.' },
      { image: '/meal-placeholder.png', text: 'Top with breadcrumbs, bake briefly.' },
    ],
    creator: 'Laura Smith',
    creator_email: 'laurasmith@example.com',
    category: ['cheese'],
  },
  {
    title: 'Authentic Pizza',
    slug: 'authentic-pizza',
    image: '/meals/pizza.png',
    description: 'Hand-tossed pizza with fresh toppings.',
    ingredients: [
      { text: 'Pizza dough', amount: '1 ball' },
      { text: 'Tomato sauce', amount: '100g' },
      { text: 'Cheese', amount: '100g' },
      { text: 'Favorite toppings', amount: 'as desired' },
      { text: 'Basil leaves', amount: 'a few' },
    ],
    instructions: [
      { image: '/meal-placeholder.png', text: 'Stretch dough.' },
      { image: '/meal-placeholder.png', text: 'Add sauce and toppings.' },
      { image: '/meal-placeholder.png', text: 'Bake at high heat.' },
      { image: '/meal-placeholder.png', text: 'Garnish with basil.' },
    ],
    creator: 'Mario Rossi',
    creator_email: 'mariorossi@example.com',
    category: ['cheese'],
  },
  {
    title: 'Wiener Schnitzel',
    slug: 'wiener-schnitzel',
    image: '/meals/schnitzel.png',
    description: 'Crispy breaded veal cutlet.',
    ingredients: [
      { text: 'Veal cutlets', amount: '2' },
      { text: 'Flour', amount: '50g' },
      { text: 'Eggs', amount: '2' },
      { text: 'Breadcrumbs', amount: '100g' },
      { text: 'Oil', amount: 'for frying' },
      { text: 'Lemon', amount: '1 slice' },
    ],
    instructions: [
      { image: '/meal-placeholder.png', text: 'Prepare breading stations.' },
      { image: '/meal-placeholder.png', text: 'Coat cutlets flour, egg, crumbs.' },
      { image: '/meal-placeholder.png', text: 'Fry until golden.' },
      { image: '/meal-placeholder.png', text: 'Serve with lemon.' },
    ],
    creator: 'Franz Huber',
    creator_email: 'franzhuber@example.com',
    category: ['vegan'],
  },
  {
    title: 'Fresh Tomato Salad',
    slug: 'fresh-tomato-salad',
    image: '/meals/tomato-salad.png',
    description: 'Refreshing tomato basil salad.',
    ingredients: [
      { text: 'Fresh tomatoes', amount: '2' },
      { text: 'Basil', amount: 'a handful' },
      { text: 'Salt', amount: 'to taste' },
      { text: 'Pepper', amount: 'to taste' },
      { text: 'Olive oil', amount: '2 tbsp' },
      { text: 'Balsamic vinegar', amount: '1 tbsp' },
    ],
    instructions: [
      { image: '/meal-placeholder.png', text: 'Slice tomatoes.' },
      { image: '/meal-placeholder.png', text: 'Add basil and season.' },
      { image: '/meal-placeholder.png', text: 'Dress with oil & vinegar.' },
      { image: '/meal-placeholder.png', text: 'Toss and serve.' },
    ],
    creator: 'Sophia Green',
    creator_email: 'sophiagreen@example.com',
    category: ['vegan'],
  },
];

// language=SQL
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS meals
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    category
    TEXT
    NOT
    NULL,
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
                       category,
                       description,
                       ingredients,
                       instructions,
                       creator,
                       creator_email)
    VALUES (@slug,
            @title,
            @image,
            @category,
            @description,
            @ingredients,
            @instructions,
            @creator,
            @creator_email)
  `);

  for (const meal of dummyMeals) {
    stmt.run({
      ...meal,
      category: JSON.stringify(meal.category),
      ingredients: JSON.stringify(meal.ingredients),
      instructions: JSON.stringify(meal.instructions),
    });
  }
}

initData();