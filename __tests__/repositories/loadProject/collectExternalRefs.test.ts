import type { JsonRecord } from '@/definitions';
import { collectExternalRefs } from '@/repositories/loadProject/collectExternalRefs';

jest.mock('@/helpers/pathHelpers', () => ({
  resolvePath: jest.fn(
    ({ absoluteDir, relativePath }) => `${absoluteDir}::${relativePath}`,
  ),
}));

describe('collectExternalRefs', () => {
  test('empty object', () => {
    expect(collectExternalRefs({}, '/root')).toEqual([]);
  });

  test('a single external file', () => {
    const doc = { $ref: './schemas/Pet.yaml#/Pet' };

    expect(collectExternalRefs(doc, '/base')).toEqual([
      '/base::./schemas/Pet.yaml',
    ]);
  });

  test('ignores internal refs', () => {
    const doc = { $ref: '#/components/schemas/Pet' };
    expect(collectExternalRefs(doc, '/base')).toEqual([]);
  });

  test('collects refs nested inside arrays and objects', () => {
    const doc: JsonRecord = {
      paths: [{ x: { $ref: '../a.yaml#/A' } }, { y: [{ $ref: 'b.yaml#/B' }] }],
    };

    const result = collectExternalRefs(doc, '/base');
    expect(new Set(result)).toEqual(
      new Set(['/base::../a.yaml', '/base::b.yaml']),
    );
  });

  test('deduplicates refs', () => {
    const doc = {
      a: { $ref: './x.yaml#/X' },
      b: { nested: { $ref: './x.yaml#/X' } },
      c: [{ $ref: './x.yaml#/X' }],
    };

    const result = collectExternalRefs(doc, '/base');
    expect(result).toEqual(['/base::./x.yaml']);
  });

  test('url refs', () => {
    const doc = { $ref: 'https://example.com/a.yaml?x=1#/A' };
    expect(collectExternalRefs(doc, '/base')).toEqual([
      'https://example.com/a.yaml?x=1',
    ]);
  });

  test('ignores siblings when $ref exists', () => {
    const doc = {
      $ref: './base.yaml#/Base',
      anyOf: [{ $ref: './variantA.yaml#/A' }, { $ref: './variantB.yaml#/B' }],
      nested: { $ref: './nested.yaml#/N' },
    };

    expect(collectExternalRefs(doc, '/base')).toEqual(['/base::./base.yaml']);
  });

  test('ignore non-string $ref', () => {
    const doc = { $ref: 123, x: { $ref: './ok.yaml#/Ok' } };
    expect(collectExternalRefs(doc, '/base')).toEqual(['/base::./ok.yaml']);
  });
});
