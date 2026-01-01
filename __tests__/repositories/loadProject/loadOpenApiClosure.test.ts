import { AppError, type JsonRecord } from '@/definitions';
import { loadOpenApiClosure } from '@/repositories/loadProject/loadOpenApiClosure';
import * as pathHelpers from '@/helpers/pathHelpers';
import * as collectExternalRefs from '@/repositories/loadProject/collectExternalRefs';
import * as fileIO from '@/repositories/loadProject/readJsonRecordWithStat';
import type { JsonRecordDocumentWithStat } from '@/repositories/loadProject/types';

const readJsonRecordWithStatMock = jest.spyOn(fileIO, 'readJsonRecordWithStat');
const getDirFromFilePathMock = jest.spyOn(pathHelpers, 'getDirFromFilePath');
const collectExternalRefsMock = jest.spyOn(
  collectExternalRefs,
  'collectExternalRefs',
);

function makeDocument(
  path: string,
  json: JsonRecord,
): JsonRecordDocumentWithStat {
  return {
    type: 'json',
    text: JSON.stringify(json),
    path,
    json,
    hash: '',
    mtime: 123456789000,
  };
}

describe('loadOpenApiClosure', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getDirFromFilePathMock.mockReturnValue('/dir');
  });

  test('all good', async () => {
    const entry = '/dir/openapi.json';
    const fileA = '/dir/fileA.json';
    const fileB = '/dir/fileB.json';
    const common = '/dir/common.json';

    readJsonRecordWithStatMock.mockImplementation(async path => {
      switch (path) {
        case entry:
          return makeDocument(path, { id: 'entry' });
        case fileA:
          return makeDocument(path, { id: 'fileA' });
        case fileB:
          return makeDocument(path, { id: 'fileB' });
        case common:
          return makeDocument(path, { id: 'common' });
        default:
          throw new Error('unexpected path');
      }
    });

    collectExternalRefsMock.mockImplementation(json => {
      switch (json?.id) {
        case 'entry':
          return new Set([fileA, fileB]);
        case 'fileA':
          return new Set([common]);
        case 'fileB':
          return new Set();
        case 'common':
          return new Set();
        default:
          return new Set();
      }
    });

    const res = await loadOpenApiClosure(entry);

    expect(new Set(res.openApiDocs.keys())).toEqual(
      new Set([entry, fileA, fileB, common]),
    );

    expect(new Set(res.forwardDeps.keys())).toEqual(
      new Set([entry, fileA, fileB, common]),
    );
    expect(res.forwardDeps.get(entry)).toEqual(new Set([fileA, fileB]));
    expect(res.forwardDeps.get(fileA)).toEqual(new Set([common]));
    expect(res.forwardDeps.get(fileB)).toEqual(new Set());
    expect(res.forwardDeps.get(common)).toEqual(new Set());

    expect(getDirFromFilePathMock).toHaveBeenCalledWith(entry);
    expect(getDirFromFilePathMock).toHaveBeenCalledWith(fileA);
    expect(getDirFromFilePathMock).toHaveBeenCalledWith(fileB);
    expect(getDirFromFilePathMock).toHaveBeenCalledWith(common);

    expect(collectExternalRefsMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'entry' }),
      '/dir',
    );
    expect(collectExternalRefsMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'fileA' }),
      '/dir',
    );
  });

  test('entry file cannot be read', async () => {
    const entry = '/dir/openapi.json';

    readJsonRecordWithStatMock.mockRejectedValue(
      new AppError({ code: 'fileNotExist' }),
    );

    const promise = loadOpenApiClosure(entry);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({ code: 'fileNotExist' });
  });

  test('missing/unreadable', async () => {
    const entry = '/dir/openapi.json';
    const missing = '/dir/missing.json';

    readJsonRecordWithStatMock.mockImplementation(async path => {
      switch (path) {
        case entry:
          return makeDocument(path, { id: 'entry' });
        case missing:
          throw new AppError({ code: 'ENOENT' });
        default:
          throw new AppError({ code: 'unexpected path' });
      }
    });

    const promise = loadOpenApiClosure(entry);
    await expect(promise).rejects.toBeInstanceOf(AppError);
    expect(readJsonRecordWithStatMock).toHaveBeenCalledTimes(2);
  });

  test('does not loop on cycles', async () => {
    const entry = '/dir/openapi.json';
    const fileA = '/dir/fileA.json';

    readJsonRecordWithStatMock.mockImplementation(async path => {
      switch (path) {
        case entry:
          return makeDocument(path, { id: 'entry' });
        case fileA:
          return makeDocument(path, { id: 'fileA' });
        default:
          throw new Error('unexpected path');
      }
    });

    collectExternalRefsMock.mockImplementation(json => {
      if (json?.id === 'entry') {
        return new Set([fileA]);
      }
      if (json?.id === 'fileA') {
        return new Set([entry]);
      }
      return new Set();
    });

    const res = await loadOpenApiClosure(entry);

    expect(new Set(res.openApiDocs.keys())).toEqual(new Set([entry, fileA]));
    expect(readJsonRecordWithStatMock).toHaveBeenCalledTimes(2);

    expect(res.forwardDeps.get(entry)).toEqual(new Set([fileA]));
    expect(res.forwardDeps.get(fileA)).toEqual(new Set([entry]));
  });
});
