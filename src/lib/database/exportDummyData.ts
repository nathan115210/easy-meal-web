import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('./database/meals.db');

//Table creation
const meals = db.prepare('SELECT * FROM meals').all();

/*
const ingredients = db.prepare('SELECT * FROM ingredients').all();
const instructions = db.prepare('SELECT * FROM instructions').all();
*/

const exportData = { meals };
fs.writeFileSync('./meals.json', JSON.stringify(exportData));

console.log('Data exported to export.json');
