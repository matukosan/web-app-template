// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: {
				userId: string;
				claims: {
					azp: string;
					exp: number;
					iat: number;
					iss: string;
					nbf: number;
					sid: string;
					sub: string;
					org_id?: string;
					org_permissions?: [];
					org_role?: string;
					org_slug?: string;
				};
			};
			user: {
				id: string;
				email: string;
			} | null;
			owner: {
				organization: {
					id: string;
					name: string;
				} | null;
				id: string;
				userId: string | null;
				orgId: string;
				createdAt: Date;
				modifiedAt: Date;
			} | null;
			organizations: {
				organization: {
					id: string;
					name: string;
				} | null;
			} | null;
			activeOrgId: string;
			activeOrg: {
				organization: {
					id: string;
					name: string;
				} | null;
				role: string;
				ownerId: string;
			} | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
