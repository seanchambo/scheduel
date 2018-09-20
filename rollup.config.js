import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import visualizer from 'rollup-plugin-visualizer';

const externals = [
  '^react$',
  '^react-dom$',
  '^react-dnd$',
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
      'react-dnd': 'ReactDnD',
    },
  },
  external,
  plugins: [
    builtins(),
    resolve(),
    commonjs({
      include: ['node_modules/**', 'lib/**/*.js']
    }),
    visualizer(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
};
