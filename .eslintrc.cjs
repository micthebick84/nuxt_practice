module.exports = {
  root: true,
  env: {
    browser: true, // Execute in browser environment
    node: true, // Execute in node environment
  },
  parser: 'vue-eslint-parser', // Parser to use when analyzing Vue.js code
  parserOptions: {
    ecmaVersion: 'latest', // Use latest ECMAScript version
    parser: '@typescript-eslint/parser', // Parser to use for parsing TypeScript code
    sourceType: 'module', // Write code in ECMAScript module format
  },
  plugins: ['@typescript-eslint', 'vue'],
  extends: [
    'eslint:recommended', // ESLint recommended rules (eslint)
    'plugin:nuxt/recommended', // Nuxt.js recommended rules (eslint-plugin-nuxt)
    'plugin:vue/recommended', // Vue.js recommended rules (eslint-plugin-vue)
    'plugin:@typescript-eslint/recommended', // TypeScript ESLint rules (@typescript-eslint/eslint-plugin)
    '@nuxtjs/eslint-config-typescript', // ESLint rules for Nuxt.js projects with TypeScript (@nuxtjs/eslint-config-typescript)
    'plugin:prettier/recommended', // Prevent conflicts between ESLint and Prettier (eslint-config-prettier, eslint-plugin-prettier)
  ],
  rules: {
    'no-console': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        arrowSpacing: ['error', { before: true, after: true }],
        singleQuote: true,
        semi: true,
        useTabs: false,
        tabWidth: 2,
        trailingComma: 'all',
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: 'always',
        endOfLine: 'auto',
      },
    ],
  },
};
