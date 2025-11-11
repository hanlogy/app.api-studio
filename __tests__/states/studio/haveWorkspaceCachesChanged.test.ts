import { haveWorkspaceCachesChanged } from '@/states/studio/haveWorkspaceCachesChanged';

describe('haveWorkspaceCachesChanged', () => {
  it('false if both empty', () => {
    expect(haveWorkspaceCachesChanged([], [])).toBe(false);
  });

  it('true if not same length', () => {
    expect(
      haveWorkspaceCachesChanged(
        [
          {
            name: 'foo',
            dir: '/dir',
          },
        ],
        [],
      ),
    ).toBe(true);
  });

  it('true if not same order', () => {
    expect(
      haveWorkspaceCachesChanged(
        [
          {
            name: 'fooA',
            dir: '/dirA',
          },
          {
            name: 'fooB',
            dir: '/dirB',
          },
        ],
        [
          {
            name: 'fooB',
            dir: '/dirA',
          },
          {
            name: 'fooA',
            dir: '/dirB',
          },
        ],
      ),
    ).toBe(true);
  });

  it('false if exact the same', () => {
    expect(
      haveWorkspaceCachesChanged(
        [
          {
            name: 'fooA',
            dir: '/dirA',
          },
          {
            name: 'fooB',
            dir: '/dirB',
          },
        ],
        [
          {
            name: 'fooA',
            dir: '/dirA',
          },
          {
            name: 'fooB',
            dir: '/dirB',
          },
        ],
      ),
    ).toBe(false);
  });
});
