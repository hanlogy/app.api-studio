import { resolveResourceKey } from '@/lib/resolveWorkspace/resolveResourceKey';

describe('collection', () => {
  test('no id, no name', () => {
    expect(resolveResourceKey('collection')).toMatch(/^[0-9]+$/);
  });

  test('no id, with name', () => {
    expect(resolveResourceKey('collection', { name: ' Hello   World ' })).toBe(
      'hello_world',
    );
  });

  test('both id and name', () => {
    expect(
      resolveResourceKey('collection', { id: 'foo', name: ' Hello   World ' }),
    ).toBe('foo');
  });
});

describe('request', () => {
  test('no id, no name', () => {
    expect(
      resolveResourceKey('request', { collectionKey: 'foo' }),
    ).toStrictEqual([expect.stringMatching(/^[0-9]+$/), 'foo']);
  });

  test('no id, with name', () => {
    expect(
      resolveResourceKey('request', {
        collectionKey: 'foo',
        name: ' Hello   World ',
      }),
    ).toStrictEqual(['hello_world', 'foo']);
  });

  test('both id and name', () => {
    expect(
      resolveResourceKey('request', {
        collectionKey: 'foo',
        id: 'bar',
        name: ' Hello   World ',
      }),
    ).toStrictEqual(['bar', 'foo']);
  });
});
