/*
import {parseConfigFile} from '@/lib/parseWorkspace/parseConfigFile';
import * as readJsonModule from '@/helpers/fileIO';

jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  readDir: jest.fn(),
}));

describe('parseConfigFile', () => {
  test('parseConfigFile', async () => {
    const spy = jest.spyOn(readJsonModule, 'readJsonRecordFile').mockResolvedValue({
      name: 'My App',
      description: 'Test app',
      environments: {
        '@global': {
          headers: {name: 'foo'},
        },
        dev: {':api': 'https://dev.api'},
      },
    });

    const result = await parseConfigFile('/tmp/config.json');

    expect(result).toStrictEqual({
      name: 'My App',
      description: 'Test app',
      environments: [
        {
          name: '@global',
          isGlobal: true,
          headers: {name: 'foo'},
          valuesMap: {},
        },
        {
          name: 'dev',
          isGlobal: false,
          headers: {},
          valuesMap: {api: 'https://dev.api'},
        },
      ],
    });
    spy.mockRestore();
  });
});
*/
