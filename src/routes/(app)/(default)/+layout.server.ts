import type { EnrichedRequestEvent } from '@/types';

export const ssr = false;

export async function load(event: EnrichedRequestEvent) {
	return event.locals;
}
