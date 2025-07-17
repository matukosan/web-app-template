import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json({
		message: 'CORS is working!',
		timestamp: new Date().toISOString(),
		status: 'success'
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	return json({
		message: 'POST request received',
		data: body,
		timestamp: new Date().toISOString(),
		status: 'success'
	});
};
