import type { FilterGroup, FilterCondition } from '$lib/components/ui/data-table/types';

type SqlParams = {
	text: string;
	values: any[];
};

/**
 * Converts a filter condition to a SQL WHERE clause with parameterized values
 */
function conditionToSql(condition: FilterCondition, paramOffset: number): SqlParams {
	const columnName = condition.column;
	const value = condition.value;

	switch (condition.operator) {
		case 'contains':
			return {
				text: `${columnName}::text ILIKE $${paramOffset}`,
				values: [`%${value}%`]
			};
		case 'equals':
			return {
				text: `${columnName}::text = $${paramOffset}`,
				values: [value]
			};
		case 'startsWith':
			return {
				text: `${columnName}::text ILIKE $${paramOffset}`,
				values: [`${value}%`]
			};
		case 'endsWith':
			return {
				text: `${columnName}::text ILIKE $${paramOffset}`,
				values: [`%${value}`]
			};
		case 'greaterThan':
			return {
				text: `${columnName}::numeric > $${paramOffset}`,
				values: [value]
			};
		case 'lessThan':
			return {
				text: `${columnName}::numeric < $${paramOffset}`,
				values: [value]
			};
		default:
			throw new Error(`Unsupported operator: ${condition.operator}`);
	}
}

/**
 * Recursively converts a filter group to a SQL WHERE clause
 */
function filterGroupToSql(group: FilterGroup, paramOffset = 1): SqlParams {
	const parts: string[] = [];
	const values: any[] = [];

	// Process conditions
	for (const condition of group.conditions) {
		const sql = conditionToSql(condition, paramOffset + values.length);
		parts.push(sql.text);
		values.push(...sql.values);
	}

	// Process nested groups
	if (group.groups) {
		for (const nestedGroup of group.groups) {
			const sql = filterGroupToSql(nestedGroup, paramOffset + values.length);
			parts.push(`(${sql.text})`);
			values.push(...sql.values);
		}
	}

	// If no conditions or groups, return empty
	if (parts.length === 0) {
		return { text: '1=1', values: [] };
	}

	// Join parts with the group operator
	const operator = ` ${group.operator} `;
	return {
		text: parts.join(operator),
		values
	};
}

/**
 * Converts an array of filter groups to a complete SQL WHERE clause
 */
export function filtersToSql(filterGroups: FilterGroup[]): SqlParams {
	if (!filterGroups || filterGroups.length === 0) {
		return { text: '', values: [] };
	}

	const parts: string[] = [];
	const values: any[] = [];

	for (const group of filterGroups) {
		const sql = filterGroupToSql(group, 1 + values.length);
		if (sql.text !== '1=1') {
			parts.push(`(${sql.text})`);
			values.push(...sql.values);
		}
	}

	if (parts.length === 0) {
		return { text: '', values: [] };
	}

	return {
		text: `WHERE ${parts.join(' AND ')}`,
		values
	};
}

/**
 * Example usage:
 *
 * const filterGroups = [{
 *   id: '123',
 *   conditions: [
 *     { column: 'name', operator: 'contains', value: 'John' },
 *     { column: 'age', operator: 'greaterThan', value: '25' }
 *   ],
 *   operator: 'AND',
 *   groups: [{
 *     id: '456',
 *     conditions: [
 *       { column: 'city', operator: 'equals', value: 'New York' }
 *     ],
 *     operator: 'OR',
 *     groups: []
 *   }]
 * }];
 *
 * const sql = filtersToSql(filterGroups);
 * // Result:
 * // {
 * //   text: 'WHERE (name::text ILIKE $1 AND age::numeric > $2 AND (city::text = $3))',
 * //   values: ['%John%', '25', 'New York']
 * // }
 */
