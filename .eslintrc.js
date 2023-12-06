module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    parser: '@babel/eslint-parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 12,
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {},
    plugins: ['import'],
    globals: {
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
    },
};
