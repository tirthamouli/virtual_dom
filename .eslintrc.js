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
    'no-param-reassign': 0,
    'class-methods-use-this': 0,
    'new-cap': 0,
    'no-underscore-dangle': 0,
    'no-use-before-define': 0,
    'no-continue': 0,
  },
};
