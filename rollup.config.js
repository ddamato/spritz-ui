import pkg from './package.json';
import html from 'rollup-plugin-html';
import css from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/index.js',
  plugins: [
    html(),
    css({ inject: false }),
    resolve(),
    commonjs(),
    terser(),
  ],
  output: [{
    file: pkg.main,
    exports: 'named',
    format: 'umd',
    name: 'spritz-ui',
  }, {
    file: pkg.module,
    format: 'esm',
  }]
};