import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies }) => {
		// Clear auth cookies
		cookies.delete('auth_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });

		throw redirect(302, '/signin');
	}
};
