import { z } from 'zod';
import type { RequestEvent } from '@sveltejs/kit';

type StructuredFormData = string | boolean | number | File | StructuredFormData[];

export function formBody(body: FormData) {
	return [...body.entries()].reduce(
		(data, [k, v]) => {
			let value: StructuredFormData = v;

			if (v === 'undefined') return data;

			if (v === 'true') value = true;
			if (v === 'false') value = false;
			if (v !== '' && !isNaN(Number(v))) value = Number(v);

			// For grouped fields like multi-selects and checkboxes, we need to
			// store the values in an array.
			if (k in data) {
				const val = data[k];
				value = Array.isArray(val) ? [...val, value] : [val, value];
			}

			data[k] = value;

			return data;
		},
		{} as Record<string, StructuredFormData>
	);
}

export async function parseRequest<T>(
	event: RequestEvent,
	schema: z.ZodTypeAny
): Promise<T | null> {
	const formData = formBody(await event.request.formData());
	return schema.parse(formData);
}
