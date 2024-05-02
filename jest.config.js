/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  collectCoverage: true,
  clearMocks: true,
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg|webp|webm|woff|woff2|eot|ttf|otf)$': '<rootDir>/jest/__mocks__/fileMock.js',
    '^@components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/app/utils/$1',
    '^@style/(.*)$': '<rootDir>/src/style/$1',
    '^@services/(.*)$': '<rootDir>/src/app/services/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@fonts/(.*)$': '<rootDir>/src/fonts/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.+(js|ts)'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleFileExtensions: ['ts', 'js'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
