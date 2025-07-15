import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '$env/static/private';

import crypto from 'crypto';
import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export function generateAccessToken(payload: object) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: object) {
	return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch {
		return null;
	}
}

export function verifyRefreshToken(token: string) {
	try {
		return jwt.verify(token, JWT_REFRESH_SECRET);
	} catch {
		return null;
	}
}

/**
 * Generate a secure reset token (hex-encoded random string).
 */
export function createResetToken(): string {
	return crypto.randomBytes(32).toString('hex');
}

/**
 * Find a user by valid (not expired) reset token.
 */
export async function getUserByResetToken(token: string) {
	const [user] = await db.select().from(userTable).where(eq(userTable.reset_token, token));

	if (!user || !user.reset_token_expiry) return null;

	const isExpired = new Date(user.reset_token_expiry) < new Date();
	return isExpired ? null : user;
}

/**
 * Clear a reset token from the user record after it's used.
 */
export async function clearResetToken(userId: string) {
	await db
		.update(userTable)
		.set({ reset_token: null, reset_token_expiry: null })
		.where(eq(userTable.id, userId));
}
