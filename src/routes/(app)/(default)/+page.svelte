<script>
	import { Button } from '@/components/ui/button';
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<div class="p-6">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold">
			Hello World {data?.user?.email ? `- ${data.user.email}` : ''}
		</h1>

		<form method="POST" action="/logout" use:enhance>
			<Button variant="outline" type="submit">Sign Out</Button>
		</form>
	</div>
</div>
