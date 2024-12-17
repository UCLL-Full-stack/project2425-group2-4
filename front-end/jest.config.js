module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': 'esbuild-jest',  // Make sure esbuild-jest is used for JS/TS/TSX files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@types/(.*)$': '<rootDir>/types/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
  },
};