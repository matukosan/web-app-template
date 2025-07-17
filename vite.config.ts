import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'start-up-request',
			configureServer(server) {
				server.httpServer?.on('listening', async () => {
					const port = server.config.server?.port || 5173;
					await fetch(`http://localhost:${port}`).catch((e) => console.error(e));
				});
			}
		}
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
		proxy: {
			'/socket.io': {
				target: 'ws://localhost:3000',
				ws: true
			}
		}
	}
});
