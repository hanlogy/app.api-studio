module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!react-native|react-native-fs)/'],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
