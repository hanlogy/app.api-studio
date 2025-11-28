import { matchRoute } from '@/lib/HttpServer/matchRoute';

describe('matchRoute', () => {
  test('method mismatch', () => {
    const routes = [
      {
        method: 'GET',
        path: '/welcome',
      },
    ] as const;

    const result = matchRoute(routes, {
      method: 'POST',
      path: '/welcome',
    });

    expect(result).toBeUndefined();
  });

  test('path mismatch', () => {
    const routes = [
      {
        method: 'GET',
        path: '/welcome',
      },
    ] as const;

    const result = matchRoute(routes, {
      method: 'GET',
      path: '/other',
    });

    expect(result).toBeUndefined();
  });

  test('returns captured params', () => {
    const routes = [
      {
        method: 'GET',
        path: '/users/:id',
      },
    ] as const;

    const result = matchRoute(routes, {
      method: 'GET',
      path: '/users/42',
    });

    expect(result).toStrictEqual({
      route: routes[0],
      params: { id: '42' },
    });
  });

  test('ALL method matches all', () => {
    const routes = [
      {
        method: 'ALL',
        path: '/welcome',
      },
    ] as const;

    expect(
      matchRoute(routes, {
        method: 'GET',
        path: '/welcome',
      }),
    ).toStrictEqual({
      route: routes[0],
      params: {},
    });

    expect(
      matchRoute(routes, {
        method: 'POST',
        path: '/welcome',
      }),
    ).toStrictEqual({
      route: routes[0],
      params: {},
    });
  });

  describe('returns the best match', () => {
    const routes = [
      {
        method: 'GET',
        path: '/users/*',
      },
      {
        method: 'GET',
        path: '/users/123',
      },
      {
        method: 'GET',
        path: '/users/:id',
      },
    ] as const;

    test('literal match', () => {
      expect(
        matchRoute(routes, {
          method: 'GET',
          path: '/users/123',
        }),
      ).toStrictEqual({
        route: routes[1],
        params: {},
      });
    });

    test('param match', () => {
      expect(
        matchRoute(routes, {
          method: 'GET',
          path: '/users/456',
        }),
      ).toStrictEqual({
        route: routes[2],
        params: { id: '456' },
      });

      expect(
        matchRoute(routes, {
          method: 'GET',
          path: '/users/123/info.html',
        }),
      ).toStrictEqual({
        route: routes[0],
        params: { '*': '123/info.html' },
      });
    });

    test('wildcards match', () => {
      expect(
        matchRoute(routes, {
          method: 'GET',
          path: '/users/123/info.html',
        }),
      ).toStrictEqual({
        route: routes[0],
        params: { '*': '123/info.html' },
      });
    });
  });
});
