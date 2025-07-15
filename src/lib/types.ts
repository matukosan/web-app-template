export interface Service {
	id: number;
	name: string;
	incidents?: Array<{
		status: string;
	}>;
}

export interface Hardware {
	id: number;
	name: string;
}

export interface Application {
	id: number;
	name: string;
	shortName?: string;
	description?: string;
	boundedContextId?: string;
	createdAt: Date;
	modifiedAt: Date;
	attributes?: ApplicationAttribute[];
	services?: ApplicationService[];
}

export interface ApplicationAttribute {
	id: number;
	name: string;
	options: ApplicationAttributeOption[];
}

export interface ApplicationAttributeOption {
	id: number;
	name: string;
}

export interface ApplicationService {
	id: number;
	name: string;
	incidents?: Incident[];
}

export interface Incident {
	id: number;
	severity: number;
	status: string;
	description?: string;
	createdAt: Date;
	modifiedAt: Date;
}

export interface CodeRepository {
	id: number;
	name: string;
	slug: string;
	link: string;
	project?: string;
	owner_id: string;
	sync_status?: 'not_synced' | 'syncing' | 'synced' | 'failed';
	sync_last_attempted?: Date;
	sync_error?: string;
	last_commit_date?: Date;
	last_commit_by?: string;
	total_lines_of_code?: number;
	created_at: Date;
	modified_at: Date;
}

export interface ComponentCodeRepository {
	component_id: number;
	code_repository_id: number;
	created_at: Date;
}
