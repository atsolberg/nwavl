import defaultConfig from '@epic-web/config/prettier';

/** @type {import("prettier").Options} */
export default {
  ...defaultConfig,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  semi: true,
  useTabs: false,
};
