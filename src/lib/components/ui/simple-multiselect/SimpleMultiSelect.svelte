<script lang="ts">
	import { clickOutside } from '@/util/click-outside';
	import { Check, ChevronDown, ChevronsUpDown } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { Input } from '../input';

	interface Props {
		items: { value: string | number; label: string }[];
		activeItem?: string | number;
		onSelect: (value: string | number) => void;
		actions?: Snippet;
		itemGroupLabel?: string;
		placeholder?: string;
		TriggerIcon?: any;
		search?: boolean;
	}

	const {
		items,
		activeItem,
		onSelect,
		actions,
		itemGroupLabel,
		placeholder = 'Select an option',
		TriggerIcon = ChevronDown,
		search = false
	}: Props = $props();

	let open = $state(false);
	let searchValue = $state('');

	const handleClickOutside = () => {
		open = false;
	};

	const close = () => {
		open = false;
	};

	const filteredItems = $derived(
		items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()))
	);

	$effect(() => {
		if (open) {
			searchValue = '';
		}
	});
</script>

{#if items}
	<div>
		<!-- <label id="listbox-label" class="block text-sm/6 font-medium text-gray-900">Assigned to</label> -->
		<div class="relative" use:clickOutside onclick_outside={handleClickOutside}>
			<button
				onclick={() => (open = !open)}
				type="button"
				class="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
				aria-haspopup="listbox"
				aria-expanded="true"
				aria-labelledby="listbox-label"
			>
				<span class="col-start-1 row-start-1 truncate pr-6"
					>{items.find((item) => {
						console.log('item', item);
						console.log('activeItem', activeItem);
						return item.value === activeItem;
					})?.label ?? placeholder}</span
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
					class="py-2 transition ease-in duration-100 absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm {open
						? 'opacity-100'
						: 'opacity-0'}"
				>
					{#if search}
						<div class="p-2">
							<Input type="text" placeholder="Search" autofocus bind:value={searchValue} />
						</div>
					{/if}
					<label
						for="organization-select"
						class="pl-4 pr-4 block text-sm/6 font-medium text-gray-900">{itemGroupLabel}</label
					>
					<ul
						id="organization-select"
						tabindex="-1"
						role="listbox"
						aria-labelledby="listbox-label"
						aria-activedescendant="listbox-option-3"
					>
						<!--
              Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.
      
              Highlighted: "bg-indigo-600 text-white outline-none", Not Highlighted: "text-gray-900"
            -->
						{#each filteredItems as item}
							<li class="" id="listbox-option-0" role="option">
								<button
									class="w-full relative cursor-pointer text-left select-none py-2 pl-8 pr-4 text-gray-900 hover:bg-gray-100"
									onclick={() => {
										onSelect(item.value);
										open = false;
									}}
								>
									<!-- Selected: "font-semibold", Not Selected: "font-normal" -->
									<span class="block truncate font-normal">{item.label}</span>

									<!--
                        Checkmark, only display for selected option.
              
                        Highlighted: "text-white", Not Highlighted: "text-indigo-600"
                      -->
									{#if item.value === activeItem}
										<span
											class="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600"
										>
											<Check class="size-5" />
										</span>
									{/if}
								</button>
							</li>
						{/each}
					</ul>

					{#if actions}
						<div class="border-b border-gray-200 my-2" />

						{@render actions(close)}
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
