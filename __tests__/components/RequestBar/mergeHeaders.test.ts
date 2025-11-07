import { mergeHeaders } from '@/components/RequestBar/mergeHeaders';

const globalEnv = {
  headers: { a: 'a1', b: 'b1' },
  isGlobal: true,
};
const namedEnv = {
  headers: { a: 'a2', c: 'c2' },
  isGlobal: false,
};

describe('mergeHeaders', () => {
  test('for the environment headers', () => {
    const result = {
      a: 'a2',
      b: 'b1',
      c: 'c2',
    };

    expect(mergeHeaders({ environments: [globalEnv, namedEnv] })).toStrictEqual(
      result,
    );

    expect(mergeHeaders({ environments: [namedEnv, globalEnv] })).toStrictEqual(
      result,
    );
  });

  test('collection override env ', () => {
    expect(
      mergeHeaders({
        environments: [globalEnv],
        collection: { headers: { a: 'a3' } },
      }),
    ).toStrictEqual({ a: 'a3', b: 'b1' });

    expect(
      mergeHeaders({
        collection: { headers: { a: 'a3' } },
      }),
    ).toStrictEqual({ a: 'a3' });
  });

  test('local override all', () => {
    expect(
      mergeHeaders({
        environments: [globalEnv],
        collection: { headers: { a: 'a3' } },
        headers: { a: 'a4' },
      }),
    ).toStrictEqual({ a: 'a4', b: 'b1' });
  });
});
