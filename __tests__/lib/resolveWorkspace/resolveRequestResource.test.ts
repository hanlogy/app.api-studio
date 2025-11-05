import { resolveRequestResource } from '@/lib/resolveWorkspace/resolveRequestResource';

describe('resolveRequestResource', () => {
  test('invalid source', () => {
    expect(
      resolveRequestResource({ collectionKey: '1', source: null }),
    ).toBeUndefined();
  });

  test('empty', () => {
    expect(
      resolveRequestResource({
        collectionKey: '1',
        source: {},
      }),
    ).toStrictEqual({
      key: expect.any(Array),
    });
  });

  test('with everything', () => {
    expect(
      resolveRequestResource({
        collectionKey: 'collection_1',
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
      key: expect.any(Array),
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
