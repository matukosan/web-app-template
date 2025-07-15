import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
	cardinalities,
	nodeTypesTable,
	componentTypes,
	technologies,
	hostingPlattforms
} from './schema';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const main = async () => {
	const client = postgres({
		user: process.env.DATABASE_USER as string,
		password: process.env.DATABASE_PASSWORD as string,
		host: process.env.DATABASE_HOST as string,
		port: parseInt(process.env.DATABASE_PORT as string) || 5432,
		database: process.env.DATABASE_DATABASE || 'postgres'
	});
	const db = drizzle(client);
	const data: (typeof nodeTypesTable.$inferInsert)[] = [];

	const ownerId = '77dcc532-e795-42c6-9861-0cc4fea13f5b';

	data.push({
		name: 'Domain',
		slug: 'domain'
	});

	data.push({
		name: 'Subdomain',
		slug: 'subdomain'
	});

	data.push({
		name: 'Bounded Context',
		slug: 'bounded-context'
	});

	const cardinalitiesData: (typeof cardinalities.$inferInsert)[] = [
		{ name: 'one-to-one' },
		{ name: 'one-to-many' },
		{ name: 'many-to-one' },
		{ name: 'zero-to-one' },
		{ name: 'zero-to-many' },
		{ name: 'one-to-zero' },
		{ name: 'many-to-zero' }
	];

	const componentTypesData: (typeof componentTypes.$inferInsert)[] = [
		{ name: 'CMP', ownerId },
		{ name: 'SPA', ownerId },
		{ name: 'Database', ownerId },
		{ name: 'Kafka Topic', ownerId },
		{ name: 'Kafka Stream', ownerId },
		{ name: 'Kafka Connector', ownerId }
	];

	const technologyData: (typeof technologies.$inferInsert)[] = [
		{ name: 'Java', ownerId },
		{ name: 'Angular', ownerId },
		{ name: 'MSSQL', ownerId },
		{ name: 'Postgres', ownerId },
		{ name: 'Kafka', ownerId },
		{ name: 'RabbitMQ', ownerId }
	];

	const hostingPlattformData: (typeof hostingPlattforms.$inferInsert)[] = [
		{ name: 'Kubernetes', ownerId },
		{ name: 'VM', ownerId },
		{ name: 'Cloud', ownerId }
	];

	console.log('Seed start');
	await db.insert(nodeTypesTable).values(data);
	await db.insert(cardinalities).values(cardinalitiesData);
	await db.insert(componentTypes).values(componentTypesData);
	await db.insert(technologies).values(technologyData);
	await db.insert(hostingPlattforms).values(hostingPlattformData);
	console.log('Seed done');
	return;
};

main();
