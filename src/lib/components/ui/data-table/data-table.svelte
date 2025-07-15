<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Column, TableState, SortDirection, FilterGroup, FilterCondition } from './types';
	import FilterBuilder from './filter-builder.svelte';
	import { filtersToSql } from '$lib/util/filter-to-sql';

	// Props
	let {
		data,
		columns,
		pageSize = 10
	} = $props<{
		data: any[];
		columns: Column<any>[];
		pageSize?: number;
	}>();

	// Convert to state
	let dataState = $state(data);
	let columnsState = $state(columns);
	let pageSizeState = $state(pageSize);

	// State declarations
	let tableState = $state<TableState>({
		page: 1,
		pageSize: pageSizeState,
		filterGroups: [
			{
				id: crypto.randomUUID(),
				conditions: [],
				operator: 'AND',
				groups: []
			}
		]
	});

	let showFilters = $state(false);

	// Helper functions
	function evaluateCondition(condition: FilterCondition, row: any): boolean {
		const value = String(row[condition.column]).toLowerCase();
		const filterValue = condition.value.toLowerCase();

		switch (condition.operator) {
			case 'contains':
				return value.includes(filterValue);
			case 'equals':
				return value === filterValue;
			case 'startsWith':
				return value.startsWith(filterValue);
			case 'endsWith':
				return value.endsWith(filterValue);
			case 'greaterThan':
				return parseFloat(value) > parseFloat(filterValue);
			case 'lessThan':
				return parseFloat(value) < parseFloat(filterValue);
			default:
				return false;
		}
	}

	function evaluateFilterGroup(group: FilterGroup, row: any): boolean {
		const conditionsResult =
			group.conditions.length > 0
				? group.operator === 'AND'
					? group.conditions.every((c) => evaluateCondition(c, row))
					: group.conditions.some((c) => evaluateCondition(c, row))
				: true;

		const groupsResult =
			group.groups && group.groups.length > 0
				? group.operator === 'AND'
					? group.groups.every((g) => evaluateFilterGroup(g, row))
					: group.groups.some((g) => evaluateFilterGroup(g, row))
				: true;

		return group.operator === 'AND'
			? conditionsResult && groupsResult
			: conditionsResult || groupsResult;
	}

	// Derived states
	let filteredData = $derived.by(() => {
		let processed = [...dataState];

		if (tableState.search) {
			const searchTerm = tableState.search.toLowerCase();
			processed = processed.filter((row) =>
				columnsState.some(
					(col) => col.searchable && String(row[col.key]).toLowerCase().includes(searchTerm)
				)
			);
		}

		// Apply complex filters
		if (tableState.filterGroups.length > 0) {
			processed = processed.filter((row) =>
				tableState.filterGroups.every((group) => evaluateFilterGroup(group, row))
			);
		}

		if (tableState.sortColumn) {
			processed.sort((a, b) => {
				const aVal = a[tableState.sortColumn!];
				const bVal = b[tableState.sortColumn!];
				const direction = tableState.sortDirection === 'desc' ? -1 : 1;

				if (typeof aVal === 'string') {
					return direction * aVal.localeCompare(bVal);
				}
				return direction * (aVal - bVal);
			});
		}

		return processed;
	});

	let displayData = $derived.by(() => {
		const start = (tableState.page - 1) * tableState.pageSize;
		return filteredData.slice(start, start + tableState.pageSize);
	});

	let totalPages = $derived.by(() => Math.ceil(filteredData.length / tableState.pageSize));

	// Event handlers
	function handleFilterUpdate(group: FilterGroup) {
		tableState.filterGroups = [group];
		tableState.page = 1;
	}

	// URL state management
	$effect(() => {
		if (typeof window === 'undefined') return;

		const params = new URLSearchParams();
		params.set('page', tableState.page.toString());
		params.set('pageSize', tableState.pageSize.toString());

		if (tableState.sortColumn) {
			params.set('sortColumn', tableState.sortColumn);
			params.set('sortDirection', tableState.sortDirection || 'asc');
		}

		if (tableState.search) {
			params.set('search', tableState.search);
		}

		Object.entries(tableState.filterGroups).forEach(([key, value]) => {
			params.set(`filter_${key}`, value);
		});

		goto(`?${params.toString()}`, { replaceState: true, keepFocus: true });
	});

	// Initialize from URL params
	onMount(() => {
		const params = new URLSearchParams($page.url.searchParams);

		tableState.page = parseInt(params.get('page') || '1');
		tableState.pageSize = parseInt(params.get('pageSize') || pageSizeState.toString());
		tableState.sortColumn = params.get('sortColumn') || undefined;
		tableState.sortDirection = (params.get('sortDirection') as SortDirection) || undefined;
		tableState.search = params.get('search') || undefined;

		columnsState.forEach((col) => {
			if (col.filterable) {
				const filterValue = params.get(`filter_${col.key}`);
				if (filterValue) {
					tableState.filters[col.key as string] = filterValue;
				}
			}
		});
	});

	// Event handlers
	function handleSort(column: Column<any>) {
		if (!column.sortable) return;

		if (tableState.sortColumn === column.key) {
			tableState.sortDirection = tableState.sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			tableState.sortColumn = column.key as string;
			tableState.sortDirection = 'asc';
		}
	}

	function handleSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		tableState.search = value;
		tableState.page = 1;
	}

	function handlePageChange(newPage: number) {
		tableState.page = Math.max(1, Math.min(newPage, totalPages));
	}

	function handlePageSizeChange(event: Event) {
		const newSize = parseInt((event.target as HTMLSelectElement).value);
		tableState.pageSize = newSize;
		tableState.page = 1;
	}

	function handleGenerateSQL() {
		const whereClause = filtersToSql(tableState.filterGroups);

		const query = `
            SELECT * 
            FROM your_table 
            ${whereClause.text}
        `;

		console.log(query);
	}
</script>

<div class="w-full space-y-4">
	<div class="flex justify-between items-center">
		<div class="w-full max-w-md">
			<input
				type="text"
				placeholder="Search..."
				value={tableState.search || ''}
				on:input={handleSearch}
				class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
			/>
		</div>

		<div class="flex gap-2">
			<button
				on:click={() => (showFilters = !showFilters)}
				class="px-4 py-2 text-sm font-medium rounded-md border border-gray-200
					hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				{showFilters ? 'Hide Filters' : 'Show Filters'}
			</button>

			<button
				on:click={handleGenerateSQL}
				class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md
					hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				Generate SQL
			</button>
		</div>
	</div>

	{#if showFilters}
		<div class="border rounded-lg p-4 bg-gray-50">
			<FilterBuilder
				columns={columnsState}
				filterGroup={tableState.filterGroups[0]}
				onUpdate={handleFilterUpdate}
				onRemove={() => {}}
				isRoot={true}
			/>
		</div>
	{/if}

	<!-- Table Container -->
	<div class="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
		<table class="w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					{#each columnsState as column}
						<th class="group px-6 py-3 text-left">
							<div class="space-y-2">
								<span
									class={`inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:text-gray-700' : ''}`}
									on:click={() => handleSort(column)}
								>
									{column.label}
									{#if column.sortable}
										<span class="ml-2">
											{#if tableState.sortColumn === column.key}
												<span class="text-blue-500">
													{tableState.sortDirection === 'asc' ? '↑' : '↓'}
												</span>
											{:else}
												<span class="text-gray-300 group-hover:text-gray-400">↕</span>
											{/if}
										</span>
									{/if}
								</span>
							</div>
						</th>
					{/each}
				</tr>
			</thead>

			<tbody class="bg-white divide-y divide-gray-200">
				{#each displayData as row}
					<tr class="hover:bg-gray-50 transition-colors">
						{#each columnsState as column}
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
								{#if column.renderer}
									{@html column.renderer(row[column.key], row)}
								{:else}
									{row[column.key]}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	<div
		class="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg"
	>
		<div class="flex items-center space-x-2">
			<button
				class="px-4 py-2 text-sm font-medium rounded-md border border-gray-200
					hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
					disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={tableState.page === 1}
				on:click={() => handlePageChange(tableState.page - 1)}
			>
				Previous
			</button>

			<span class="text-sm text-gray-700">
				Page {tableState.page} of {totalPages}
			</span>

			<button
				class="px-4 py-2 text-sm font-medium rounded-md border border-gray-200
					hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
					disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={tableState.page === totalPages}
				on:click={() => handlePageChange(tableState.page + 1)}
			>
				Next
			</button>
		</div>

		<div class="flex items-center space-x-2">
			<span class="text-sm text-gray-700">Show</span>
			<select
				value={tableState.pageSize}
				on:change={handlePageSizeChange}
				class="px-3 py-2 text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
			>
				<option value={10}>10</option>
				<option value={25}>25</option>
				<option value={50}>50</option>
				<option value={100}>100</option>
			</select>
			<span class="text-sm text-gray-700">entries</span>
		</div>
	</div>
</div>
