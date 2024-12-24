const ts = require('rollup-plugin-typescript2')
const terser = require('@rollup/plugin-terser')
const pkg = require('./package.json')

const banner = [
    '/*!',
    ` * ${pkg.name} v${pkg.version}`,
    ` * ${pkg.description}`,
    ' * Copyright (c) 会功夫的李白(https://github.com/jl15988).',
    ' * This source code is licensed under the MIT license(https://github.com/jl15988/uni-easy-file/blob/master/LICENSE).',
    ' */'
].join('\n')

function createConfig(options) {
    const config = {
        input: './src/index.ts',
        output: {
            name: 'uniEasyFile',
            file: options.file,
            format: options.format === 'types' ? 'es' : options.format,
            exports: 'auto',
            banner,
        },
        plugins: [
            // 解析 ts
            ts({
                check: options.format === 'types',
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: options.format === 'types',
                    },
                    exclude: []
                }
            }),
            process.env.NODE_ENV === 'production' ? terser() : null
        ]
    }

    return config
}

exports.default = [
    createConfig({format: 'cjs', file: pkg.common}),
    createConfig({format: 'es', file: pkg.module}),
    createConfig({format: 'types', file: pkg.typings})
]
