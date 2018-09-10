import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

const externals = [
  '^react$',
  '^react-dom$',
  '^date-fns$',
]

const externalRegex = new RegExp(externals.join('|'));

const external = id => externalRegex.test(id)

export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'Schedeul',
    exports: 'named',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'date-fns': 'dateFns',
    },
  },
  external,
  plugins: [
    builtins(),
    resolve(),
    commonjs({
      include: ['node_modules/**', 'lib/**/*.js']
    }),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
};
