import * as fileIO from '@/helpers/fileIO';
import { readStudioCache } from '@/repositories/studioCache';

describe('readStudioCache', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns {} when cache is invalid', async () => {
    jest.spyOn(fileIO, 'readJsonRecord').mockResolvedValue(null);
    expect(await readStudioCache()).toStrictEqual({});
  });

  it('returns {}', async () => {
    jest.spyOn(fileIO, 'readJsonRecord').mockResolvedValue({});
    expect(await readStudioCache()).toStrictEqual({});
  });

  it('returns workspaces', async () => {
    jest.spyOn(fileIO, 'readJsonRecord').mockResolvedValue({
      workspaces: [
        {
          name: 'foo',
          dir: '/path/to/workspace',
        },
      ],
    });

    expect(await readStudioCache()).toStrictEqual({
      workspaces: [
        {
          name: 'foo',
          dir: '/path/to/workspace',
        },
      ],
    });
  });
});
