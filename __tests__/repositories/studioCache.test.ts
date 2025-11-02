import * as fileIO from '@/helpers/fileIO';
import {readStudioCache} from '@/repositories/studioCache';

describe('readStudioCache', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns null when cache is null', async () => {
    jest.spyOn(fileIO, 'readJsonRecord').mockResolvedValue(null);
    expect(await readStudioCache()).toBeNull();
  });
});
