import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export type User = {
	id: string;
	email: string;
	password_hash?: string;
	reset_token?: string | null;
	reset_token_expiry?: Date | null;
};

export type CreateUserInput = {
	email: string;
};

export type UpdateUserInput = {
	email?: string;
};

export class UserService {
	static async create(input: CreateUserInput): Promise<User> {
		const id = crypto.randomUUID();

		const [newUser] = await db
			.insert(userTable)
			.values({
				id,
				email: input.email
			} as const)
			.returning();

		return newUser;
	}

	static async findById(id: string): Promise<User | null> {
		const [user] = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1);
		return user || null;
	}

	static async findByEmail(email: string): Promise<User | null> {
		const [user] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
		return user || null;
	}

	static async update(id: string, input: UpdateUserInput): Promise<User | null> {
		const updateData: Partial<User> = {};

		if (input.email) updateData.email = input.email;

		const [updatedUser] = await db
			.update(userTable)
			.set(updateData)
			.where(eq(userTable.id, id))
			.returning();

		return updatedUser || null;
	}

	static async delete(id: string): Promise<boolean> {
		const result = await db.delete(userTable).where(eq(userTable.id, id));
		return result.length > 0;
	}
}
