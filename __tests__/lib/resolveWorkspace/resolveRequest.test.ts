import { resolveRequest } from '@/lib/resolveWorkspace/resolveRequest';

describe('resolveRequest', () => {
  test('invalid source', () => {
    expect(
      resolveRequest({
        collectionKey: '1',
        source: null,
        accumulateIds: [],
      }),
    ).toBeUndefined();
  });

  test('empty', () => {
    expect(
      resolveRequest({
        collectionKey: '1',
        source: {},
        accumulateIds: [],
      }),
    ).toBeUndefined();
  });

  test('with everything', () => {
    expect(
      resolveRequest({
        accumulateIds: [],
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
      order: expect.any(Number),
      key: expect.any(Array),
      id: 'request_1',
      name: 'request-1',
      method: 'POST',
      url: 'api?limit=10',
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
