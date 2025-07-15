import { redirect } from '@sveltejs/kit';
import type { EnrichedRequestEvent } from '@/types';

export async function load(event: EnrichedRequestEvent) {
	if (!event.locals.user) {
		throw redirect(302, '/signin');
	}
	
	return event.locals;
}