// jest.setup.ts
jest.mock('react-native-fs', () => ({
  LibraryDirectoryPath: '/mock/library/path',
  exists: jest.fn().mockResolvedValue(false),
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));
