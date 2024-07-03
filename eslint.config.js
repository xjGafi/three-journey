import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'assets/*',
    ],
  },
  {
    rules: {
      'no-console': 0,
    },
  },
)
