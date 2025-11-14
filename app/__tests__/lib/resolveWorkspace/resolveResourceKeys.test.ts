import { resolveResourceKeys } from '@/lib/resolveWorkspace/resolveResourceKeys';

describe('collection', () => {
  test('no id, no name', () => {
    expect(
      resolveResourceKeys('collection', {
        accumulateIds: [],
      }),
    ).toBeUndefined();
  });

  test('no id, invalid name', () => {
    expect(
      resolveResourceKeys('collection', {
        accumulateIds: [],
        name: [1],
      }),
    ).toBeUndefined();
  });

  test('no id, valid name', () => {
    expect(
      resolveResourceKeys('collection', {
        accumulateIds: [],
        name: 100,
      }),
    ).toStrictEqual({
      name: '100',
      id: '100',
      key: '100',
    });
  });

  test('invalid id, valid name', () => {
    expect(
      resolveResourceKeys('collection', {
        accumulateIds: [],
        name: 100,
        id: ['id'],
      }),
    ).toStrictEqual({
      name: '100',
      id: '100',
      key: '100',
    });
  });

  test('both id name are valid', () => {
    expect(
      resolveResourceKeys('collection', {
        accumulateIds: [],
        name: 100,
        id: 200,
      }),
    ).toStrictEqual({
      name: '100',
      id: '200',
      key: '200',
    });
  });

  test('valid name, but not unique', () => {
    const accumulateIds = ['100'];
    expect(
      resolveResourceKeys('collection', {
        accumulateIds,
        name: 100,
      }),
    ).toStrictEqual({
      name: '100',
      id: '100_1',
      key: '100_1',
    });

    expect(accumulateIds).toStrictEqual(['100', '100']);
  });

  test('valid id, but not unique', () => {
    const accumulateIds = ['200'];
    expect(
      resolveResourceKeys('collection', {
        accumulateIds,
        name: 100,
        id: 200,
      }),
    ).toStrictEqual({
      name: '100',
      id: '200_1',
      key: '200_1',
    });
    expect(accumulateIds).toStrictEqual(['200', '200']);
  });
});

describe('request', () => {
  test('no id, no name', () => {
    expect(
      resolveResourceKeys('request', {
        collectionKey: 'foo',
        accumulateIds: [],
      }),
    ).toBeUndefined();
  });

  test('no id, invalid name', () => {
    expect(
      resolveResourceKeys('request', {
        collectionKey: 'foo',
        name: [100],
        accumulateIds: [],
      }),
    ).toBeUndefined();
  });

  test('no id, valid name', () => {
    expect(
      resolveResourceKeys('request', {
        collectionKey: 'foo',
        accumulateIds: [],
        name: 100,
      }),
    ).toStrictEqual({
      name: '100',
      id: '100',
      key: ['100', 'foo'],
    });
  });

  test('invalid id, valid name', () => {
    expect(
      resolveResourceKeys('request', {
        accumulateIds: [],
        collectionKey: 'foo',
        name: 100,
        id: ['id'],
      }),
    ).toStrictEqual({
      name: '100',
      id: '100',
      key: ['100', 'foo'],
    });
  });

  test('both id name are valid', () => {
    expect(
      resolveResourceKeys('request', {
        accumulateIds: [],
        collectionKey: 'foo',
        name: 100,
        id: 200,
      }),
    ).toStrictEqual({
      name: '100',
      id: '200',
      key: ['200', 'foo'],
    });
  });

  test('valid name, but not unique', () => {
    const accumulateIds = ['100'];
    expect(
      resolveResourceKeys('request', {
        accumulateIds,
        collectionKey: 'foo',
        name: 100,
      }),
    ).toStrictEqual({
      name: '100',
      id: '100_1',
      key: ['100_1', 'foo'],
    });
    expect(accumulateIds).toStrictEqual(['100', '100']);
  });

  test('valid id, but not unique', () => {
    const accumulateIds = ['200'];
    expect(
      resolveResourceKeys('request', {
        accumulateIds,
        collectionKey: 'foo',
        name: 100,
        id: 200,
      }),
    ).toStrictEqual({
      name: '100',
      id: '200_1',
      key: ['200_1', 'foo'],
    });
    expect(accumulateIds).toStrictEqual(['200', '200']);
  });
});
