import { env } from '$env/dynamic/private';
import { generateAccessToken, generateRefreshToken } from '$lib/auth/jwt';
import { UserService, type User } from './user.service';
import { createOneTimeToken, deleteOneTimeToken, getOneTimeToken } from './one-time-token.service';
import { sendOneTimePasswordEmail } from '$lib/email/send';
import { fail } from '@sveltejs/kit';

export class AuthService {
	static async requestOTP(email: string) {
		if (!email) {
			return fail(400, { error: 'Missing fields' });
		}

		const user = await UserService.findByEmail(email);
		const enableSignup = env.ENABLE_SIGNUP === 'true' || false;

		if (!user && !enableSignup) {
			console.log('User not found and signup is disabled');
			return { success: true };
		}

		const otp = await createOneTimeToken({
			relatesTo: email,
			userId: user?.id
		});
		await sendOneTimePasswordEmail(email, otp.token);

		return { success: true };
	}

	static async login(
		otp: string
	): Promise<{ accessToken: string; refreshToken: string; user: User } | { error: string }> {
		if (!otp) {
			return { error: 'Missing fields' };
		}

		const tokenData = await getOneTimeToken(otp);
		if (!tokenData) return { error: 'Invalid credentials' };

		let user = await UserService.findByEmail(tokenData.relatesTo);
		if (!user) {
			// Create new user if they don't exist
			user = await UserService.create({
				email: tokenData.relatesTo
			});
		}

		const accessToken = generateAccessToken({ userId: user.id, email: user.email });
		const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

		await deleteOneTimeToken(tokenData.id);

		return {
			accessToken,
			refreshToken,
			user
		};
	}
}
