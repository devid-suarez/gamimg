import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    base: '/gamimg/',
    plugins: [angular({ tsconfig: './tsconfig.json' })],
    server: {
        host: '0.0.0.0',
        fs: {
            allow: ['.']
        }
    }
});
