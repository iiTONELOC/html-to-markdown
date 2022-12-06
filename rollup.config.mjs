import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

// import postcss from 'rollup-plugin-postcss';

import packageJson from './package.json' assert { type: 'json' };

export default {
    input: 'src/index.ts',
    output: [
        {
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true,
            strict: false
        },
        {
            file: packageJson.module,
            format: 'esm',
            sourcemap: true,
            strict: false
        }
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json'
        })
    ],
};
