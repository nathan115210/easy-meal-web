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
    instructions: `
      1. Prepare the patty:
         Mix 200g of ground beef with salt and pepper. Form into a patty.

      2. Cook the patty:
         Heat a pan with a bit of oil. Cook the patty for 2-3 minutes each side, until browned.

      3. Assemble the burger:
         Toast the burger bun halves. Place lettuce and tomato on the bottom half. Add the cooked patty and top with a slice of cheese.

      4. Serve:
         Complete the assembly with the top bun and serve hot.
    `,
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
    instructions: `
      1. Chop vegetables:
         Cut your choice of vegetables into, bite-sized pieces.

      2. Sauté vegetables:
         In a pan with oil, sauté the vegetables until they start to soften.

      3. Add curry paste:
         Stir in 2 tablespoons of curry paste and cook for another minute.

      4. Simmer with coconut milk:
         Pour in 500ml of coconut milk and bring to a simmer. Let it cook for about 15 minutes.

      5. Serve:
         Enjoy this creamy curry with rice or bread.
    `,
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
    instructions: `
      1. Prepare the filling:
         Mix minced meat, shredded vegetables, and spices.

      2. Fill the dumplings:
         Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.

      3. Steam the dumplings:
         Arrange dumplings in a steamer. Steam for about 10 minutes.

      4. Serve:
         Enjoy these dumplings hot, with a dipping sauce of your choice.
    `,
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
    instructions: `
      1. Cook the macaroni:
         Boil macaroni according to package instructions until al dente.

      2. Prepare cheese sauce:
         In a saucepan, melt butter, add flour, and gradually whisk in milk until thickened. Stir in grated cheese until melted.

      3. Combine:
         Mix the cheese sauce with the drained macaroni.

      4. Bake:
         Transfer to a baking dish, top with breadcrumbs, and bake until golden.

      5. Serve:
         Serve hot, garnished with parsley if desired.
    `,
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
    instructions: `
      1. Prepare the dough:
         Knead pizza dough and let it rise until doubled in size.

      2. Shape and add toppings:
         Roll out the dough, spread tomato sauce, and add your favorite toppings and cheese.

      3. Bake the pizza:
         Bake in a preheated oven at 220°C for about 15-20 minutes.

      4. Serve:
         Slice hot and enjoy with a sprinkle of basil leaves.
    `,
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
    instructions: `
      1. Prepare the veal:
         Pound veal cutlets to an even thickness.

      2. Bread the veal:
         Coat each cutlet in flour, dip in beaten eggs, and then in breadcrumbs.

      3. Fry the schnitzel:
      Heat oil in a pan and fry each schnitzel until golden brown on both sides.

      4. Serve:
      Serve hot with a slice of lemon and a side of potato salad or greens.
 `,
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
    instructions: `
      1. Prepare the tomatoes:
        Slice fresh tomatoes and arrange them on a plate.
    
      2. Add herbs and seasoning:
         Sprinkle chopped basil, salt, and pepper over the tomatoes.
    
      3. Dress the salad:
         Drizzle with olive oil and balsamic vinegar.
    
      4. Serve:
         Enjoy this simple, flavorful salad as a side dish or light meal.
    `,
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
  /*
    const result = db.prepare('SELECT COUNT(*) as count FROM meals').get() as { count: number };
  */
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
    });
  }
}

initData();
