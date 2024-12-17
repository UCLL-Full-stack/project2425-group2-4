module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '\\.[jt]sx?$': 'esbuild-jest',
  },
  moduleNameMapper: {
    '^@styles/(.*)$': 'identity-obj-proxy', // Mock CSS modules
    '^@services/(.*)$': '<rootDir>/services/$1', // Alias for services
    '^@types$': '<rootDir>/types', // Alias for types
  },
};
