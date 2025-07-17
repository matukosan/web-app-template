import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AuthService } from '$lib/server/services/auth.service';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { email } = body;

		if (!email) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		const result = await AuthService.requestOTP(email);

		// AuthService.requestOTP returns either a fail response or { success: true }
		if ('error' in result) {
			return json({ error: result.error }, { status: 400 });
		}

		return json({ success: true, message: 'OTP sent successfully' });
	} catch (error) {
		console.error('Error in requestOTP endpoint:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
