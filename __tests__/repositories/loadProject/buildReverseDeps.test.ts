import { buildReverseDeps } from '@/repositories/loadProject/buildReverseDeps';

describe('buildReverseDeps', () => {
  test('all good', () => {
    const forward = new Map<string, Set<string>>([
      ['/a.yaml', new Set(['/b.yaml', '/c.yaml'])],
      ['/b.yaml', new Set(['/c.yaml'])],
      ['/c.yaml', new Set()],
    ]);

    const reverse = buildReverseDeps(forward);

    expect(reverse.get('/a.yaml')).toEqual(new Set());
    expect(reverse.get('/b.yaml')).toEqual(new Set(['/a.yaml']));
    expect(reverse.get('/c.yaml')).toEqual(new Set(['/a.yaml', '/b.yaml']));
  });

  test('cycles', () => {
    const forward = new Map<string, Set<string>>([
      ['/a.yaml', new Set(['/b.yaml'])],
      ['/b.yaml', new Set(['/a.yaml'])],
    ]);

    const reverse = buildReverseDeps(forward);

    expect(reverse.get('/a.yaml')).toEqual(new Set(['/b.yaml']));
    expect(reverse.get('/b.yaml')).toEqual(new Set(['/a.yaml']));
  });

  test('empty', () => {
    const reverse = buildReverseDeps(new Map());
    expect(reverse.size).toBe(0);
  });
});
