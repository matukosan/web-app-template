import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	generateAccessToken,
	generateRefreshToken,
	getAccessTokenCookieConfig,
	getRefreshTokenCookieConfig
} from '$lib/auth/jwt';
import { UserService } from '$lib/server/services/user.service';

export const POST: RequestHandler = async ({ cookies }) => {
	const refreshToken = cookies.get('refresh_token');
	if (!refreshToken) {
		return new Response('No refresh token', { status: 401 });
	}

	const user = await UserService.findById(refreshToken);
	if (!user) {
		return new Response('Invalid refresh token', { status: 401 });
	}

	const newAccessToken = generateAccessToken({ userId: user.id, email: user.email });
	const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email });

	cookies.set('auth_token', newAccessToken, getAccessTokenCookieConfig());
	cookies.set('refresh_token', newRefreshToken, getRefreshTokenCookieConfig());

	return json({
		success: true
	});
};
