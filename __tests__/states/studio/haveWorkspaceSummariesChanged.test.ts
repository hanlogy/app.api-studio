import {haveWorkspaceSummariesChanged} from '@/states/studio/haveWorkspaceSummariesChanged';

describe('haveWorkspaceSummariesChanged', () => {
  it('false if both empty', () => {
    expect(haveWorkspaceSummariesChanged([], [])).toBe(false);
  });

  it('true if not same length', () => {
    expect(
      haveWorkspaceSummariesChanged(
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
      haveWorkspaceSummariesChanged(
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
      haveWorkspaceSummariesChanged(
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
