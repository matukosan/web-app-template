<script lang="ts">
	import type { Column, FilterGroup, FilterCondition, ComparisonOperator } from './types';

	export let columns: Column<any>[];
	export let filterGroup: FilterGroup;
	export let onUpdate: (group: FilterGroup) => void;
	export let onRemove: () => void;
	export let isRoot = false;

	const defaultOperators: ComparisonOperator[] = ['contains', 'equals', 'startsWith', 'endsWith'];

	function addCondition() {
		const newCondition: FilterCondition = {
			id: crypto.randomUUID(),
			column: columns[0].key as string,
			operator: 'contains',
			value: ''
		};
		filterGroup.conditions = [...filterGroup.conditions, newCondition];
		onUpdate(filterGroup);
	}

	function addGroup() {
		const newGroup: FilterGroup = {
			id: crypto.randomUUID(),
			conditions: [],
			operator: 'AND',
			groups: []
		};
		filterGroup.groups = [...(filterGroup.groups || []), newGroup];
		onUpdate(filterGroup);
	}

	function removeCondition(id: string) {
		filterGroup.conditions = filterGroup.conditions.filter((c) => c.id !== id);
		onUpdate(filterGroup);
	}

	function removeGroup(id: string) {
		filterGroup.groups = filterGroup.groups?.filter((g) => g.id !== id) || [];
		onUpdate(filterGroup);
	}

	function updateCondition(condition: FilterCondition) {
		const index = filterGroup.conditions.findIndex((c) => c.id === condition.id);
		if (index !== -1) {
			filterGroup.conditions[index] = condition;
			onUpdate(filterGroup);
		}
	}

	function updateNestedGroup(updatedGroup: FilterGroup) {
		const index = filterGroup.groups?.findIndex((g) => g.id === updatedGroup.id) || -1;
		if (index !== -1 && filterGroup.groups) {
			filterGroup.groups[index] = updatedGroup;
			onUpdate(filterGroup);
		}
	}
</script>

<div class="border border-gray-200 rounded-lg p-4 space-y-4">
	{#if !isRoot}
		<div class="flex items-center justify-between">
			<select
				bind:value={filterGroup.operator}
				class="px-3 py-2 text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				on:change={() => onUpdate(filterGroup)}
			>
				<option value="AND">AND</option>
				<option value="OR">OR</option>
			</select>

			<button on:click={onRemove} class="text-red-500 hover:text-red-700 text-sm">
				Remove Group
			</button>
		</div>
	{/if}

	<div class="space-y-2">
		{#each filterGroup.conditions as condition}
			<div class="flex items-center space-x-2">
				<select
					bind:value={condition.column}
					class="px-3 py-2 text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					on:change={() => updateCondition(condition)}
				>
					{#each columns.filter((c) => c.filterable) as column}
						<option value={column.key}>{column.label}</option>
					{/each}
				</select>

				<select
					bind:value={condition.operator}
					class="px-3 py-2 text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					on:change={() => updateCondition(condition)}
				>
					{#each columns.find((c) => c.key === condition.column)?.filterOperators || defaultOperators as operator}
						<option value={operator}>{operator}</option>
					{/each}
				</select>

				<input
					type="text"
					bind:value={condition.value}
					class="flex-1 px-3 py-2 text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					on:input={() => updateCondition(condition)}
					placeholder="Value..."
				/>

				<button
					on:click={() => removeCondition(condition.id)}
					class="text-red-500 hover:text-red-700 text-sm"
				>
					Remove
				</button>
			</div>
		{/each}
	</div>

	{#if filterGroup.groups}
		<div class="space-y-4 pl-4 border-l-2 border-gray-200">
			{#each filterGroup.groups as group}
				<svelte:self
					{columns}
					filterGroup={group}
					onUpdate={updateNestedGroup}
					onRemove={() => removeGroup(group.id)}
				/>
			{/each}
		</div>
	{/if}

	<div class="flex space-x-2">
		<button
			on:click={addCondition}
			class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
		>
			+ Add Condition
		</button>
		<button
			on:click={addGroup}
			class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
		>
			+ Add Group
		</button>
	</div>
</div>
