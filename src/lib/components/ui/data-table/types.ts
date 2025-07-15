export type SortDirection = 'asc' | 'desc';

export interface Column<T> {
	key: keyof T;
	label: string;
	sortable?: boolean;
	filterable?: boolean;
	searchable?: boolean;
	renderer?: (value: T[keyof T], row: T) => string | SVGElement | HTMLElement;
}

export interface TableState {
	page: number;
	pageSize: number;
	sortColumn?: string;
	sortDirection?: SortDirection;
	search?: string;
	filters: Record<string, string>;
}

export type SortDirection = 'asc' | 'desc';
export type FilterOperator = 'AND' | 'OR';
export type ComparisonOperator =
	| 'contains'
	| 'equals'
	| 'startsWith'
	| 'endsWith'
	| 'greaterThan'
	| 'lessThan';

export interface FilterCondition {
	id: string;
	column: string;
	value: string;
	operator: ComparisonOperator;
}

export interface FilterGroup {
	id: string;
	conditions: FilterCondition[];
	operator: FilterOperator;
	groups?: FilterGroup[];
}

export interface Column<T> {
	key: keyof T;
	label: string;
	sortable?: boolean;
	filterable?: boolean;
	searchable?: boolean;
	filterOperators?: ComparisonOperator[];
	renderer?: (value: T[keyof T], row: T) => string | SVGElement | HTMLElement;
}

export interface TableState {
	page: number;
	pageSize: number;
	sortColumn?: string;
	sortDirection?: SortDirection;
	search?: string;
	filterGroups: FilterGroup[];
}
