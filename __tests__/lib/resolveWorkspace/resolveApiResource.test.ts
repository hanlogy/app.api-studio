/*
import * as readJsonModule from '@/helpers/fileIO';
import {parseApiFile} from '@/lib/parseWorkspace/parseApiFile';

jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  readDir: jest.fn(),
}));

describe('parseApiFile', () => {
  test('A collection', async () => {
    const spy = jest.spyOn(readJsonModule, 'readJsonRecordFile').mockResolvedValue({
      name: 'My Collection',
      description: 'Test app',
      baseUrl: 'api',
      ':name': 'foo',
      headers: {ping: '{{name}}'},
      apis: [
        {
          name: 'api-1',
          method: 'POST',
          url: 'look',
          ':lastName': 'bar',
          query: {limit: 10},
          body: {
            firstName: '{{name}}',
            lastName: '{{lastName}}',
          },
        },
      ],
    });

    const result = await parseApiFile('/tmp/api.json');
    console.log(JSON.stringify(result, undefined, '  '));
    //
    spy.mockRestore();
  });

  test('A single API', async () => {
    const spy = jest.spyOn(readJsonModule, 'readJsonRecordFile').mockResolvedValue({
      name: 'Test Api',
      url: '{{host}}/test',
      method: 'POST',
      ':authToken': 'fake-token',
      headers: {
        Authorization: '{{authToken}}',
      },
      body: {
        label: '{{label}}',
      },
    });

    const result = await parseApiFile('/tmp/api.json', {
      variables: {
        host: 'api',
        label: 'foo',
      },
    });
    expect(result).toStrictEqual({
      name: 'Test Api',
      url: 'api/test',
      method: 'POST',
      headers: {Authorization: 'fake-token'},
      body: {label: 'foo'},
      variables: {authToken: 'fake-token'},
    });
    //
    spy.mockRestore();
  });
});
*/
