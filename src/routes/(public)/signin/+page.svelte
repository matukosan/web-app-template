<script lang="ts">
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	const { data } = $props<{ invitation: string | null }>();

	let error = $state<string | null>(null);
	let email = $state<string | null>(null);
	let otp = $state<string | null>(null);
	let showOTPForm = $state(false);

	function handleEmailSubmit({ formData }: { formData: FormData }) {
		email = formData.get('email') as string;
		showOTPForm = true;
	}

	$effect(() => {
		if (data.user) {
			if (data.invitation) {
				goto(`/new-auth/invite/accept?token=${data.invitation}`);
			} else {
				goto('/new-auth/dashboard');
			}
		}
	});
</script>

<div class="w-full h-screen flex flex-col gap-4 items-center justify-center">
	<h1 class="text-2xl font-bold mb-4">Welcome to App Template 2!</h1>

	{#if data.error}
		<p class="text-red-500 text-sm mt-4">Invalid login token</p>
	{/if}

	{#if !showOTPForm}
		<form
			class="w-full max-w-sm space-y-6"
			method="POST"
			action={'?/requestOTP'}
			use:enhance={handleEmailSubmit}
		>
			<div class="space-y-4">
				<p class="text-sm text-gray-500 mb-4">Enter your email to sign in or create an account.</p>
				<div>
					<label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
					<div class="mt-2">
						<Input
							type="email"
							id="email"
							bind:value={email}
							placeholder="Enter your email"
							required
						/>
					</div>
				</div>
			</div>

			<input type="hidden" name="invitation" value={data.invitation} />
			<input type="hidden" name="email" value={email} />
			<Button type="submit" class="w-full">Send verification code</Button>
		</form>
	{:else}
		<form method="POST" class="max-w-sm space-y-4" action="?/login">
			<div class="space-y-4">
				<p class="text-sm text-gray-500 mb-4">
					{#if !data.enableSignup}
						If you have an account, we sent a verification code to {email}
					{:else}
						We sent a verification code to {email}
					{/if}
				</p>
				<div>
					<Input
						id="otp"
						name="otp"
						bind:value={otp}
						placeholder="Enter verification code"
						required
						class="input"
						autofocus
						on:paste={async (e) => {
							// Wait for bind:value to update
							await new Promise((resolve) => setTimeout(resolve, 0));
							// Submit parent form after paste
							const form = (e.target as HTMLElement).closest('form');
							if (form) form.submit();
						}}
					/>
				</div>
			</div>
			<input type="hidden" name="email" value={email} />
			<input type="hidden" name="otp" value={otp} />
			<input type="hidden" name="invitation" value={data.invitation} />
			<Button type="submit" class="w-full">Verify Code</Button>
		</form>
	{/if}

	{#if error}
		<p class="text-red-500 text-sm mt-4">{error}</p>
	{/if}
</div>
