const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/unit/$1',
    '^@mock/(.*)$': '<rootDir>/test/unit/mock/$1',
    '^@page/(.*)$': '<rootDir>/src/page/$1',
    '^@dui/(.*)$': '@ddjf/ddpad/packages/',
    '^@static/(.*)$': '<rootDir>/static/config/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@ddjf/ddpad))/'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e'
  ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/css/**',
    '!src/entry/**',
    '!src/image/**',
    '!src/router/index.js',
    '!**/node_modules/**'
  ],
  'verbose': true,
  'testURL': 'http://localhost/'
}
