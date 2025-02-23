import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	envDir: './environments',
	server: { port: 4001 },
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
