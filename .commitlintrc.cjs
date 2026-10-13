module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'refactor',
        'test',
        'build',
        'revert',
        'chore'
      ]
    ],
    'subject-case': [0, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  }
}
