import { resolveUrl } from '@/lib/resolveWorkspace/resolveUrl';

describe('resolveUrl', () => {
  test('source is invalid', () => {
    expect(
      resolveUrl({
        source: null,
      }),
    ).toBe(undefined);
  });

  test('source is an empty string', () => {
    expect(
      resolveUrl({
        source: '',
      }),
    ).toBe(undefined);
  });

  test('invalid source with valid baseurl', () => {
    expect(
      resolveUrl({
        source: null,
        baseUrl: 'foo',
      }),
    ).toBe('foo');
  });

  test('empty source with valid baseurl', () => {
    expect(
      resolveUrl({
        source: '',
        baseUrl: 'foo',
      }),
    ).toBe('foo');
  });
});
