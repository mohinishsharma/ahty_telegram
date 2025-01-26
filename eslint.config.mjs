import eslintjs from '@eslint/js';
import tslint from 'typescript-eslint';


export default tslint.config(
    {
        ...eslintjs.configs.recommended,
        ignores: [
            'node_modules/',
            'dist/**/*',
        ],
    },
    ...tslint.configs.recommended.map(r => ({
        ...r,
        ignores: [
            'node_modules/',
            'dist/**/*',
        ]
    })),
)