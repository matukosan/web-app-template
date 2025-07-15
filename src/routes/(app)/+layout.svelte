<script lang="ts">
	import '../styles.css';
	import { globalLoading } from '@/stores/globalStore';
	import { onDestroy } from 'svelte';

	let cleanup: () => void;

	onDestroy(() => {
		if (cleanup) cleanup();
	});
</script>

{#if $globalLoading}
	<div class="w-screen h-screen flex flex-col items-center justify-center gap-12">
		<h1>Loading...</h1>
	</div>
{:else}
	<div class="app grid grid-cols-1">
		<div class="">
			<!-- Main content -->
			<div class="">
				<main>
					<slot />
				</main>
			</div>
		</div>
	</div>
{/if}
