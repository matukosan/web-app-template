import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'start-up-request',
			configureServer(server) {
				server.httpServer?.on('listening', async () => {
					await fetch('http://localhost:5173').catch((e) => console.error(e));
				});
			}
		}
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		proxy: {
			'/socket.io': {
				target: 'ws://localhost:3000',
				ws: true
			}
		}
	}
});
