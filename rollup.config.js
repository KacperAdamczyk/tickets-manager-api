import babel from 'rollup-plugin-babel';

export default {
    input: './src/server.mjs',
    output: {
        file: './server.rollup.js',
        format: 'cjs'
    },
    plugins: [
        babel({
            plugins: [
                ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": false }],
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-proposal-nullish-coalescing-operator",
                "@babel/plugin-proposal-object-rest-spread"
            ]
        })
    ]
}
