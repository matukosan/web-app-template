import { db } from '$lib/server/db';
import { oneTimeTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { InferModel } from 'drizzle-orm';
import bcrypt from 'bcrypt';

type OneTimeToken = InferModel<typeof oneTimeTokens>;

export type CreateOneTimeTokenInput = {
	relatesTo: string;
	userId?: string;
};

export type UpdateOneTimeTokenInput = Partial<CreateOneTimeTokenInput>;

export type CreateOneTimeTokenResult = {
	token: string;
	record: OneTimeToken;
};

export const createOneTimeToken = async (
	input: CreateOneTimeTokenInput
): Promise<CreateOneTimeTokenResult> => {
	// Generate a random 6-digit number
	const token = Math.floor(100000 + Math.random() * 900000).toString();

	// Hash the token
	const saltRounds = 10;
	const tokenHash = await bcrypt.hash(token, saltRounds);

	// Create the record in the database
	const [record] = await db
		.insert(oneTimeTokens)
		.values({
			tokenHash,
			relatesTo: input.relatesTo,
			userId: input.userId
		})
		.returning();

	return {
		token,
		record
	};
};

export const getOneTimeTokenById = async (id: number): Promise<OneTimeToken | null> => {
	const [token] = await db.select().from(oneTimeTokens).where(eq(oneTimeTokens.id, id));

	return token || null;
};

export const getOneTimeToken = async (inputToken: string): Promise<OneTimeToken | null> => {
	// bcrypt.hash generates different hashes for the same input due to random salt
	// We need to use bcrypt.compare to check if the input matches any stored hash
	const tokens = await db.select().from(oneTimeTokens);

	// Find token where inputToken matches the stored hash
	const matchingToken = await Promise.all(
		tokens.map(async (t) => {
			const matches = await bcrypt.compare(inputToken, t.tokenHash);
			return matches ? t : null;
		})
	).then((results) => results.find((t) => t !== null));

	return matchingToken || null;
};

export const getOneTimeTokenByHash = async (tokenHash: string): Promise<OneTimeToken | null> => {
	const [token] = await db
		.select()
		.from(oneTimeTokens)
		.where(eq(oneTimeTokens.tokenHash, tokenHash));

	return token || null;
};

export const updateOneTimeToken = async (
	id: number,
	input: UpdateOneTimeTokenInput
): Promise<OneTimeToken | null> => {
	const [token] = await db
		.update(oneTimeTokens)
		.set(input)
		.where(eq(oneTimeTokens.id, id))
		.returning();

	return token || null;
};

export const deleteOneTimeToken = async (id: number): Promise<void> => {
	await db.delete(oneTimeTokens).where(eq(oneTimeTokens.id, id));
};

export const deleteOneTimeTokenByHash = async (tokenHash: string): Promise<void> => {
	await db.delete(oneTimeTokens).where(eq(oneTimeTokens.tokenHash, tokenHash));
};
