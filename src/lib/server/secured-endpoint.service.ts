import { error, type RequestEvent } from '@sveltejs/kit';

export async function guardEndpointWithApiKey(event: RequestEvent) {
	const apiKey = event.request.headers.get('apikey');
	if (!apiKey) {
		throw error(401, 'API key is required');
	}
}
