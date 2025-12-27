import { buildReverseDeps } from '@/repositories/loadProject/buildReverseDeps';

type Document = { path: string; externalRefs: string[] };

const buildMap = (docs: Document[]) =>
  new Map<string, Document>(docs.map((d, i) => [`k${i}`, d]));

const asObject = (m: Map<string, string[]>) =>
  Object.fromEntries(Array.from(m.entries()));

describe('buildReverseDeps', () => {
  test('all good', () => {
    const docs = buildMap([
      { path: '/b.yaml', externalRefs: ['/x.yaml'] },
      { path: '/a.yaml', externalRefs: ['/x.yaml', '/y.yaml'] },
      { path: '/c.yaml', externalRefs: ['/x.yaml', '/x.yaml'] },
    ]);

    const out = buildReverseDeps(docs);

    expect(out).toBeInstanceOf(Map);
    expect(asObject(out)).toStrictEqual({
      '/x.yaml': ['/a.yaml', '/b.yaml', '/c.yaml'],
      '/y.yaml': ['/a.yaml'],
    });
  });

  test('docs is empty', () => {
    const out = buildReverseDeps(buildMap([]));
    expect(out).toBeInstanceOf(Map);
    expect(out.size).toBe(0);
  });

  test('all docs have empty externalRefs', () => {
    const out = buildReverseDeps(
      buildMap([
        { path: '/a.yaml', externalRefs: [] },
        { path: '/b.yaml', externalRefs: [] },
      ]),
    );

    expect(out.size).toBe(0);
  });
});
