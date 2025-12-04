import { matchPath } from '@/lib/HttpServer/matchPath';

describe('matchPath', () => {
  test('empty path and empty pattern', () => {
    const expected = {
      path: '',
      params: {},
    };

    expect(matchPath({ path: '', pattern: '' })).toStrictEqual(expected);
    expect(matchPath({ path: '/', pattern: '/' })).toStrictEqual(expected);
    expect(matchPath({ path: '/' })).toStrictEqual(expected);
    expect(matchPath({})).toStrictEqual(expected);
    expect(matchPath()).toStrictEqual(expected);
  });

  test('non-empty path with empty pattern', () => {
    expect(
      matchPath({
        path: '/users',
        pattern: '',
      }),
    ).toBeUndefined();
    expect(
      matchPath({
        path: '/users',
        pattern: '/',
      }),
    ).toBeUndefined();
  });

  test('URL-encoded url', () => {
    expect(
      matchPath({
        path: '/users/john%20doe/1%2B2',
        pattern: '/users/:id/1%2B2',
      }),
    ).toStrictEqual({
      path: 'users/john%20doe/1%2B2',
      params: { id: 'john doe' },
    });
  });

  test('matches literal route without params', () => {
    expect(
      matchPath({
        path: '/welcome',
        pattern: '/welcome',
      }),
    ).toStrictEqual({
      path: 'welcome',
      params: {},
    });
  });

  test('literal segments do not match', () => {
    expect(
      matchPath({
        path: '/welcome2',
        pattern: '/welcome',
      }),
    ).toBeUndefined();
  });

  test('matches single param segment and returns it in params', () => {
    expect(
      matchPath({
        path: '/users/123/post',
        pattern: '/users/:id/post',
      }),
    ).toStrictEqual({
      path: 'users/123/post',
      params: { id: '123' },
    });
  });

  test('matches multiple params', () => {
    expect(
      matchPath({
        path: '/users/1/profiles/2',
        pattern: '/users/:userId/profiles/:profileId',
      }),
    ).toStrictEqual({
      path: 'users/1/profiles/2',
      params: { userId: '1', profileId: '2' },
    });
  });

  test('path is shorter than pattern', () => {
    expect(
      matchPath({
        path: '/users',
        pattern: '/users/:id',
      }),
    ).toBeUndefined();
  });

  test('ath is longer than pattern without wildcard', () => {
    expect(
      matchPath({
        path: '/users/1',
        pattern: '/users',
      }),
    ).toBeUndefined();
  });

  describe('wildcard matching', () => {
    test('captured value is not empty', () => {
      expect(
        matchPath({
          pattern: '/files/*',
          path: '/files/a/b/c.txt',
        }),
      ).toStrictEqual({
        path: 'files/a/b/c.txt',
        params: { '*': 'a/b/c.txt' },
      });
    });

    test('captured value is empty, with trailing slash', () => {
      expect(
        matchPath({
          path: '/files/',
          pattern: '/files/*',
        }),
      ).toStrictEqual({
        path: 'files',
        params: { '*': '' },
      });
    });

    test('captured value is empty, no trailing slash', () => {
      expect(
        matchPath({
          path: '/files',
          pattern: '/files/*',
        }),
      ).toStrictEqual({
        path: 'files',
        params: { '*': '' },
      });
    });

    test('captures whole path', () => {
      expect(
        matchPath({
          path: '/anything/here',
          pattern: '*',
        }),
      ).toStrictEqual({
        path: 'anything/here',
        params: { '*': 'anything/here' },
      });

      expect(
        matchPath({
          path: '/',
          pattern: '*',
        }),
      ).toStrictEqual({
        path: '',
        params: { '*': '' },
      });

      expect(
        matchPath({
          path: '',
          pattern: '*',
        }),
      ).toStrictEqual({
        path: '',
        params: { '*': '' },
      });
    });

    test('wildcard is not the last segment', () => {
      expect(
        matchPath({
          path: '/files/a/b',
          pattern: '/files/*/b',
        }),
      ).toBeUndefined();
    });

    test('param + wildcard', () => {
      expect(
        matchPath({
          path: '/users/42/files/a/b.txt',
          pattern: '/users/:id/files/*',
        }),
      ).toStrictEqual({
        path: 'users/42/files/a/b.txt',
        params: { id: '42', '*': 'a/b.txt' },
      });
    });
  });
});
