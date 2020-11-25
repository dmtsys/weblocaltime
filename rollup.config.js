import sucrase from '@rollup/plugin-sucrase'

const ts = sucrase({ transforms: ['typescript'] })

export default [
	{
		input: 'src/index.ts',
		plugins: [ts],
		output: [
			{
				format: 'esm',
				file: 'dist/index.mjs',
			},
			{
				format: 'cjs',
				file: 'dist/index.js',
			},
		],
		// Suppress "`this` has been rewritten to `undefined`" warnings
		onwarn: (warning, defaultHandler) => {
			if (warning.code === 'THIS_IS_UNDEFINED') return
			defaultHandler(warning)
		},
	},
]
