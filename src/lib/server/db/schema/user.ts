import { pgTable, varchar, uuid, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

export const user = pgTable('user', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	email: varchar('email', { length: 255 }).notNull().unique(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const insertUserSchema = createInsertSchema(user);
export type InsertUserSchemaType = z.infer<typeof insertUserSchema>;

export const deleteUserSchema = z.object({
	id: z.string().uuid()
});
export type DeleteUserSchemaType = z.infer<typeof deleteUserSchema>;
