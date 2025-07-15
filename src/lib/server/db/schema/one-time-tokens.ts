import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';

export const oneTimeTokens = pgTable('one_time_tokens', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	tokenHash: text('token_hash').notNull(),
	relatesTo: text('relates_to').notNull(),
	userId: uuid('user_id').references(() => user.id)
});

export const oneTimeTokensRelations = relations(oneTimeTokens, ({ one }) => ({
	user: one(user, {
		fields: [oneTimeTokens.userId],
		references: [user.id]
	})
}));
