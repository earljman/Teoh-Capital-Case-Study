import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const devOrigin = 'http://localhost:8888';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5173,
		strictPort: true,
		origin: devOrigin,
		hmr: {
			path: '/demo',
			clientPort: 8888
		}
	}
});
