import { db } from '@/server/db';
import { components, insertServicesSchema } from '@/server/db/schema/index';

export const ComponentRepository = {
	insert: async (data) => {
		return (
			await db
				.insert(components)
				.values(insertServicesSchema.parse({ ...data }))
				.returning()
		)[0];
	}
};
