import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

console.log(process.env.DATABASE_URL);

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

await pool.connect();

const db = drizzle(pool);

console.log(db);

const result = await db.execute(sql`select 1`);
console.log(result);
