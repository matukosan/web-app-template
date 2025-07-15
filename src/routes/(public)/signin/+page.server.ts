import { fail, redirect } from '@sveltejs/kit';
import { AuthService } from '$lib/server/services/auth.service';
import { getAccessTokenCookieConfig, getRefreshTokenCookieConfig } from '$lib/auth/jwt';
import { env } from '$env/dynamic/private';

export const load = async ({ url, cookies }) => {
	const token = url.searchParams.get('token');
	const invitation = url.searchParams.get('invitation');

	let user = null;
	if (token) {
		const tokens = await AuthService.login(token);
		if ('error' in tokens) {
			return { error: tokens.error };
		}

		user = tokens.user;

		cookies.set('auth_token', tokens.accessToken, getAccessTokenCookieConfig());
		cookies.set('refresh_token', tokens.refreshToken, getRefreshTokenCookieConfig());

		// If there's an invitation token, redirect to accept the invitation
		if (invitation) {
			throw redirect(302, `/invite/accept?token=${invitation}`);
		}

		throw redirect(302, '/');
	}

	return {
		invitation: invitation || null,
		user,
		enableSignup: env.ENABLE_SIGNUP === 'true' || false
	};
};

export const actions = {
	requestOTP: async ({ request }) => {
		const form = await request.formData();
		const email = form.get('email')?.toString();
		return AuthService.requestOTP(email);
	},
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		const otp = form.get('otp')?.toString();

		const tokens = await AuthService.login(otp);
		if ('error' in tokens) {
			return fail(401, { error: tokens.error });
		}

		cookies.set('auth_token', tokens.accessToken, getAccessTokenCookieConfig());
		cookies.set('refresh_token', tokens.refreshToken, getRefreshTokenCookieConfig());

		throw redirect(302, '/');
	}
};
