const { name } = require('../package.json');

const baseConfig = require('../jest.config');

module.exports = {
  ...baseConfig,
  name,
  displayName: name,
  testRegex:'.e2e-spec.ts$',
  collectCoverageFrom: ['**/*.(controller|service|provider|guard|pipe|interceptor|filter).(t|j)s'],
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  projects: undefined,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/../src/$1"
  },
  testEnvironment: 'node',
};