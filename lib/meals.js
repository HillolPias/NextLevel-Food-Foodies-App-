import fs from 'node:fs/promises';
import path from 'path';
import slugify from 'slugify';
import xss from 'xss';
import pool from './db.js';

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    const { rows } = await pool.query('SELECT * FROM meals');
    console.log("Fetched meals:", rows); // Add this for debugging
    return rows;
  } catch (error) {
    console.error('Failed to fetch meals:', error);
    return []; // Return empty array instead of crashing
  }
}

export async function getMeal(slug) {
  const { rows } = await pool.query('SELECT * FROM meals WHERE slug = $1', [slug]);
  return rows[0];
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;
  const imagePath = path.join('public', 'images', fileName);

  const bufferedImage = Buffer.from(await meal.image.arrayBuffer());
  await fs.writeFile(imagePath, bufferedImage);

  meal.image = `/images/${fileName}`;

  await pool.query(
    `
      INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      meal.title,
      meal.summary,
      meal.instructions,
      meal.creator,
      meal.creator_email,
      meal.image,
      meal.slug
    ]
  );
}


// import fs from "node:fs";

// import sql from "better-sqlite3";
// import slugify from "slugify";
// import xss from "xss";

// const db = sql("meals.db");

// export async function getMeals() {
//   await new Promise((resolve) => setTimeout(resolve, 5000));

//   // throw new Error('Loading meals failed');
//   return db.prepare("SELECT * FROM meals").all();
// }

// export function getMeal(slug) {
//   return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
// }

// export async function saveMeal(meal) {
//   meal.slug = slugify(meal.title, { lower: true });
//   meal.instructions = xss(meal.instructions);

//   const extension = meal.image.name.split(".").pop();
//   const fileName = `${meal.slug}.${extension}`;

//   const stream = fs.createWriteStream(`public/images/${fileName}`);
//   const bufferedImage = await meal.image.arrayBuffer();

//   stream.write(Buffer.from(bufferedImage), (error) => {
//     if (error) {
//       throw new Error("Saving image failed!");
//     }
//   });

//   meal.image = `/images/${fileName}`;

//   db.prepare(
//     `
//     INSERT INTO meals (
//        title, summary, instructions, creator, creator_email, image, slug
//     )
//     VALUES (
//        @title, @summary, @instructions, @creator, @creator_email, @image, @slug
//     )
//   `
//   ).run(meal);
// }
