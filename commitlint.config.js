/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const types = require('./tools/cz-conventional-changelog-zh/types.json')
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', Object.keys(types)],
  },
}
