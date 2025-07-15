import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
	schema: './src/lib/server/db/schema',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT || '5432'),
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_DATABASE,
		ssl: false
	},
	verbose: true,
	strict: true
} satisfies Config;
