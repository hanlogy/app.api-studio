import { resolveRequestResource } from '@/lib/resolveWorkspace/resolveRequestResource';

describe('resolveRequestResource', () => {
  test('invalid source', () => {
    expect(resolveRequestResource({ source: null })).toBeUndefined();
  });

  test('empty', () => {
    expect(
      resolveRequestResource({
        source: {},
      }),
    ).toStrictEqual({
      key: expect.any(String),
    });
  });

  test('with everything', () => {
    expect(
      resolveRequestResource({
        source: {
          name: 'request-1',
          method: 'POST',
          url: 'api',
          ':lastName': 'bar',
          query: { limit: '{{limit}}' },
          body: {
            firstName: '{{name}}',
            lastName: '{{lastName}}',
          },
        },
        valuesMap: {
          name: 'foo',
          limit: 10,
        },
      }),
    ).toStrictEqual({
      key: expect.stringMatching(/^TEMPORARY_REQUEST_ID_/),
      name: 'request-1',
      method: 'POST',
      url: 'api',
      query: { limit: '10' },
      body: {
        firstName: 'foo',
        lastName: 'bar',
      },
      valuesMap: {
        lastName: 'bar',
      },
    });
  });
});
