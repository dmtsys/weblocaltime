import nodeResolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.js',
    plugins: [nodeResolve({ preferBuiltins: false, browser: true })],
    output: [
      {
        format: 'esm',
        file: 'dist/index.mjs'
      },
      {
        format: 'cjs',
        file: 'dist/index.js'
      }
    ],
    // Suppress "`this` has been rewritten to `undefined`" warnings
    onwarn: (warning, defaultHandler) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      defaultHandler(warning);
    }
  }
];
