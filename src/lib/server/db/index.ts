import { env } from '$env/dynamic/private';
import * as schema from './schema/index';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const config = {
	user: env.DATABASE_USER as string,
	password: env.DATABASE_PASSWORD as string,
	host: env.DATABASE_HOST as string,
	port: parseInt(env.DATABASE_PORT as string) || 5432,
	database: env.DATABASE_DATABASE || 'postgres'
};

if (env.NODE_ENV !== 'development') {
	config.ssl = {
		rejectUnauthorized: false,
		mode: 'no-verify'
	};
}

const client = postgres(config);
export const db = drizzle<typeof schema>(client, { schema });
