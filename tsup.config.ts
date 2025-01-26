import { defineConfig } from 'tsup';

export default defineConfig({
    entryPoints: [
        'src/index.ts'
    ],
    format: ['cjs'],
    target: 'node16',
    minify: false,
    dts: false,
    clean: true
});