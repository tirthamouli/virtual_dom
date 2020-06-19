module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'no-restricted-syntax': 0,
    'no-console': 0,
    'import/prefer-default-export': 0,
  },
};
