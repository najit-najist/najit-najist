module.exports = {
  root: true,
  extends: ['prettier', 'next'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'turbo/no-undeclared-env-vars': 'off',
  },
};
