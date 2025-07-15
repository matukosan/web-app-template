import {
	generateAccessToken,
	generateRefreshToken,
	getAccessTokenCookieConfig,
	getRefreshTokenCookieConfig,
	verifyAccessToken,
	verifyRefreshToken
} from '$lib/auth/jwt';

import { UserService } from '@/server/services/user.service';
import type { Handle } from '@sveltejs/kit';

const refreshSession = async (refreshToken, accessToken, event) => {
	let payload = accessToken ? verifyAccessToken(accessToken) : null;
	const verifiedRefreshToken = verifyRefreshToken(refreshToken);
	const user = await UserService.findById(verifiedRefreshToken.userId);
	if (!user) {
		return new Response('Invalid refresh token', { status: 401 });
	}

	const newAccessToken = generateAccessToken({ userId: user.id, email: user.email });
	const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email });

	event.cookies.set('auth_token', newAccessToken, getAccessTokenCookieConfig());
	event.cookies.set('refresh_token', newRefreshToken, getRefreshTokenCookieConfig());

	payload = { userId: user.id, email: user.email };

	return payload;
};

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get('auth_token');
	const refreshToken = event.cookies.get('refresh_token');

	let payload = accessToken ? verifyAccessToken(accessToken) : null;

	// If access token is expired but we have a refresh token, try to refresh
	if (!payload && refreshToken) {
		payload = await refreshSession(refreshToken, accessToken, event);
	}

	event.locals.user = payload ? { id: payload.userId, email: payload.email } : null;

	const response = await resolve(event);
	return response;
};
