import bcrypt from 'bcrypt';
import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function validateUser(email: string, password: string) {
	const [user] = await db.select().from(userTable).where(eq(userTable.email, email));
	if (!user) return null;

	const valid = await bcrypt.compare(password, user.password_hash);
	return valid ? user : null;
}

export async function createUser(email: string, password: string) {
	const hash = await bcrypt.hash(password, 10);
	const id = crypto.randomUUID();
	try {
		const result = await db.insert(userTable).values({ id, email, password_hash: hash });
		return result;
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	}
}
