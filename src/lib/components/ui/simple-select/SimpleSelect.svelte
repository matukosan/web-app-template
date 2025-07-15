<script lang="ts">
	import { clickOutside } from '@/util/click-outside';
	import { Check, ChevronDown } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { Input } from '../input';

	interface Props {
		items: { value: string | number; label: string }[];
		activeItem?: string | number;
		activeItems?: string[] | number[];
		onSelect?: (value: string[] | number[] | string | number | null) => void;
		actions?: Snippet;
		itemGroupLabel?: string;
		placeholder?: string;
		TriggerIcon?: any;
		search?: boolean;
		multiSelect?: boolean;
		addHiddenInput?: string;
		clearOnSelect?: boolean;
	}

	const {
		items,
		activeItem = null,
		activeItems = null,
		onSelect,
		actions,
		itemGroupLabel,
		placeholder = 'Select an option',
		TriggerIcon = ChevronDown,
		search = false,
		multiSelect = false,
		addHiddenInput = '',
		clearOnSelect = false
	}: Props = $props();

	let open = $state(false);
	let searchValue = $state('');
	let searchInput: HTMLInputElement;
	let highlightedIndex = $state(-1);

	const filteredItems = $derived(
		items?.filter((item) => item.label?.toLowerCase().includes(searchValue.toLowerCase())) || []
	);

	let internalActiveItem = $state(activeItem);
	let internalActiveItems = $state(activeItems);

	// Update internal state when props change
	$effect(() => {
		internalActiveItem = activeItem;
	});

	$effect(() => {
		internalActiveItems = activeItems;
	});

	const handleClickOutside = () => {
		open = false;
		highlightedIndex = -1;
	};

	const close = () => {
		open = false;
		highlightedIndex = -1;
	};

	$effect(() => {
		if (open && search) {
			searchValue = '';
			// Use requestAnimationFrame to ensure DOM is updated
			requestAnimationFrame(() => {
				if (searchInput) {
					searchInput.focus();
				}
			});
		}
	});

	const handleKeyDown = (e: KeyboardEvent) => {
		if (!open) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				highlightedIndex = highlightedIndex < filteredItems.length - 1 ? highlightedIndex + 1 : 0;
				break;
			case 'ArrowUp':
				e.preventDefault();
				highlightedIndex = highlightedIndex > 0 ? highlightedIndex - 1 : filteredItems.length - 1;
				break;
			case 'Enter':
				e.preventDefault();
				if (highlightedIndex >= 0) {
					handleSelect(filteredItems[highlightedIndex].value);
				}
				break;
			case 'Escape':
				e.preventDefault();
				close();
				break;
		}
	};

	const handleSelect = (value: string | number) => {
		if (multiSelect) {
			internalActiveItems = internalActiveItems?.includes(value)
				? internalActiveItems.filter((item) => item !== value)
				: [...(internalActiveItems || []), value];

			if (onSelect) {
				onSelect(internalActiveItems);
			}
		} else {
			internalActiveItem = value;

			if (onSelect) {
				onSelect(internalActiveItem);
			}
			open = false;
		}

		if (clearOnSelect) {
			internalActiveItem = null;
			internalActiveItems = [];
		}
		highlightedIndex = -1;
	};
</script>

{#if items}
	<div>
		<div
			class="relative"
			use:clickOutside
			onclick_outside={handleClickOutside}
			onkeydown={handleKeyDown}
			role="button"
			tabindex="0"
		>
			<button
				onclick={() => (open = !open)}
				type="button"
				class="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
				aria-haspopup="listbox"
				aria-expanded="true"
				aria-labelledby="listbox-label"
			>
				<span class="col-start-1 row-start-1 truncate pr-6"
					>{multiSelect
						? items?.filter((item) => activeItems?.includes(item.value)).map((item) => item.label)
								.length
							? items
									?.filter((item) => activeItems?.includes(item.value))
									.map((item) => item.label)
									.join(', ')
							: placeholder
						: items?.find((item) => {
								return item.value === activeItem;
							})?.label || placeholder}</span
				>
				<TriggerIcon
					class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
				/>
			</button>

			<!--
          Select popover, show/hide based on select state.
    
          Entering: ""
            From: ""
            To: ""
          Leaving: "transition ease-in duration-100"
            From: "opacity-100"
            To: "opacity-0"
        -->
			{#if open}
				<div
					class="py-2 transition ease-in duration-100 absolute z-10 mt-1 w-full rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm {open
						? 'opacity-100'
						: 'opacity-0'}"
				>
					{#if search}
						<div class="sticky top-0 bg-white p-2 border-b border-gray-100">
							<Input type="text" placeholder="Search" bind:value={searchValue} autofocus />
						</div>
					{/if}
					<label
						for="organization-select"
						class="sticky top-0 bg-white pl-4 pr-4 block text-sm/6 font-medium text-gray-900"
						>{itemGroupLabel}</label
					>
					<ul
						id="organization-select"
						tabindex="-1"
						role="listbox"
						aria-labelledby="listbox-label"
						aria-activedescendant="listbox-option-3"
						class="max-h-60 overflow-y-auto"
					>
						<!--
              Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.
      
              Highlighted: "bg-indigo-600 text-white outline-none", Not Highlighted: "text-gray-900"
            -->
						{#each filteredItems as item, i}
							<li class="" id="listbox-option-{i}" role="option" aria-controls="listbox-option-{i}">
								<button
									class="w-full relative cursor-pointer text-left select-none py-2 pl-8 pr-4 {highlightedIndex ===
									i
										? 'bg-gray-200'
										: 'text-gray-900 hover:bg-gray-100'}"
									onclick={() => {
										handleSelect(item.value);
									}}
									onmouseover={() => (highlightedIndex = i)}
								>
									<!-- Selected: "font-semibold", Not Selected: "font-normal" -->
									<span class="block truncate font-normal">{item.label}</span>

									<!--
                        Checkmark, only display for selected option.
              
                        Highlighted: "text-white", Not Highlighted: "text-indigo-600"
                      -->
									{#if Array.isArray(internalActiveItems) && internalActiveItems.length > 0 ? internalActiveItems.includes(item.value) : internalActiveItem === item.value}
										<span class="absolute inset-y-0 left-0 flex items-center pl-1.5">
											<Check class="size-5" />
										</span>
									{/if}
								</button>
							</li>
						{/each}
					</ul>

					{#if actions}
						<div class="sticky bottom-0 bg-white border-t border-gray-200">
							<div class="border-b border-gray-200 my-2" />
							{@render actions(close)}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if addHiddenInput}
	<input type="hidden" name={addHiddenInput} value={internalActiveItem} />
{/if}
