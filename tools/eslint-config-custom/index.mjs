import process from 'process'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import VueEslintParser from 'vue-eslint-parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import packageJson from 'eslint-plugin-package-json/configs/recommended'
import jsoncParser from 'jsonc-eslint-parser'

const pkgLintConfig = [
  packageJson,
  {
    // ...
    // Add the following settings.
    files: ['**/*.json'], // Specify the extension or pattern you want to parse as JSON.
    languageOptions: {
      parser: jsoncParser, // Set this parser.
    },
  },
]

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: VueEslintParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    rules: {
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off',
      'no-console': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      semi: [process.env.NODE_ENV === 'production' ? 'warn' : 'error', 'never'],
      'comma-spacing': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-explicit-any': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // 'no-unused-vars': [
      //   'error',
      //   {
      //     destructuredArrayIgnorePattern: '^_',
      //     argsIgnorePattern: '^_',
      //     varsIgnorePattern: '^_',
      //   },
      // ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          destructuredArrayIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'consistent-return': 'off',
      'block-spacing': ['warn', 'always'],
      'object-curly-spacing': ['warn', 'always'],
      'no-trailing-spaces': ['warn'],
      quotes: ['warn', 'single'],
      'comma-dangle': ['warn', 'only-multiline'],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-types': 'off',
      'no-empty-function': 'off',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      // 'no-nested-ternary': 2,
      'prettier/prettier': [
        'error',
        {
          printWidth: 80, //单行长度
          tabWidth: 2, //缩进长度
          // useTabs: false, //使用空格代替tab缩进
          semi: false, //句末使用分号
          singleQuote: true, //使用单引号
          quoteProps: 'as-needed', //仅在必需时为对象的key添加引号
          jsxSingleQuote: true, // jsx中使用单引号
          // trailingComma: 'all', //多行时尽可能打印尾随逗号
          bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }
          jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
          // arrowParens: 'always', //单参数箭头函数参数周围使用圆括号-eg: (x) => x
          // requirePragma: false, //无需顶部注释即可格式化
          insertPragma: false, //在已被pretter格式化的文件顶部加上标注
          htmlWhitespaceSensitivity: 'ignore', //对HTML全局空白不敏感
          endOfLine: 'auto', //结束行形式
          embeddedLanguageFormatting: 'auto', //对引用代码进行格式化
        },
      ],
    },
  },
  {
    ignores: ['**/dist/*'],
  },
  ...pkgLintConfig,
]
