import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		if (!locals.session && !locals.user) {
			return new Response('Unauthorized', { status: 401 });
		}
		return json({ status: 'authenticated' });
	} catch (error) {
		console.error('Session check error:', error);
		return new Response('Unauthorized', { status: 401 });
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('auth_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });

	return json({ status: 'logged out' });
};
