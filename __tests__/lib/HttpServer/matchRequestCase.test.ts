import { matchRequestCase } from '@/lib/HttpServer/matchRequestCase';

describe('matchRequestCase', () => {
  test('request pattern is undefined', () => {
    expect(
      matchRequestCase({
        request: {
          method: 'GET',
          path: 'welcome',
          rawPath: 'welcome',
          headers: {},
          body: '',
        },
        requestPattern: undefined,
      }),
    ).toBe(true);
  });

  describe('with pattern', () => {
    const request = {
      method: 'GET',
      path: 'welcome',
      rawPath: 'welcome',
      headers: {},
      body: {
        name: 'foo',
        level: 100,
        flag: true,
      },
    };

    test('field missing', () => {
      expect(
        matchRequestCase({
          request,
          requestPattern: {
            body: {
              id: '{{any(String)}}',
            },
          },
        }),
      ).toBe(false);
    });

    test('matched', () => {
      expect(
        matchRequestCase({
          request,
          requestPattern: {
            body: {
              name: '{{any(String)}}',
            },
            path: 'welcome',
            method: 'GET',
          },
        }),
      ).toBe(true);
    });

    test('path does not match', () => {
      expect(
        matchRequestCase({
          request,
          requestPattern: {
            body: {
              name: '{{any(String)}}',
            },
            path: 'welcome2',
          },
        }),
      ).toBe(false);
    });

    test('method does not match', () => {
      expect(
        matchRequestCase({
          request,
          requestPattern: {
            body: {
              name: '{{any(String)}}',
            },
            method: 'POST',
          },
        }),
      ).toBe(false);
    });
  });
});
