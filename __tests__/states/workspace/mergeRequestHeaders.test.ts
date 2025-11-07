import { mergeRequestHeaders } from '@/states/workspace/mergeRequestHeaders';

const globalEnv = {
  headers: { a: 'a1', b: 'b1' },
  isGlobal: true,
};
const namedEnv = {
  headers: { a: 'a2', c: 'c2' },
  isGlobal: false,
};

describe('mergeRequestHeaders', () => {
  test('for the environment headers', () => {
    const result = {
      a: 'a2',
      b: 'b1',
      c: 'c2',
    };

    expect(
      mergeRequestHeaders({ environments: [globalEnv, namedEnv] }),
    ).toStrictEqual(result);

    expect(
      mergeRequestHeaders({ environments: [namedEnv, globalEnv] }),
    ).toStrictEqual(result);
  });

  test('collection override env ', () => {
    expect(
      mergeRequestHeaders({
        environments: [globalEnv],
        collection: { headers: { a: 'a3' } },
      }),
    ).toStrictEqual({ a: 'a3', b: 'b1' });

    expect(
      mergeRequestHeaders({
        collection: { headers: { a: 'a3' } },
      }),
    ).toStrictEqual({ a: 'a3' });
  });

  test('local override all', () => {
    expect(
      mergeRequestHeaders({
        environments: [globalEnv],
        collection: { headers: { a: 'a3' } },
        headers: { a: 'a4' },
      }),
    ).toStrictEqual({ a: 'a4', b: 'b1' });
  });
});
