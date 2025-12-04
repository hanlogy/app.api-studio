import { routeSpecificityScore } from '@/lib/HttpServer/routeSpecificityScore';

describe('routeSpecificityScore', () => {
  test('empty or root path is least specific', () => {
    expect(routeSpecificityScore('')).toBe(0);
    expect(routeSpecificityScore('/')).toBe(0);
  });

  test('literals > params > wildcards', () => {
    const wildcard = routeSpecificityScore('/users/*');
    const param = routeSpecificityScore('/users/:id');
    const literal = routeSpecificityScore('/users/123');

    expect(wildcard).toBeLessThan(param);
    expect(param).toBeLessThan(literal);
  });

  test('more segments means more specific', () => {
    const base = routeSpecificityScore('/users');
    const withChild = routeSpecificityScore('/users/123');
    const withGrandChild = routeSpecificityScore('/users/123/details');

    expect(base).toBeLessThan(withChild);
    expect(withChild).toBeLessThan(withGrandChild);
  });
});
