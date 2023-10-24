import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  ignores: [
    'assets/*',
  ],
  rules: {
    'no-console': 0,
  },
})
