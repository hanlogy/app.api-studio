import { readJsonRecord, readPlainText } from '@/helpers/fileIO';
import type { WorkspaceFiles } from './types';
import {
  WORKSPACE_COLLECTIONS_DIR,
  type JsonRecord,
  type JsonValue,
  type WorkspaceResources,
} from '@/definitions';

const fileTypeMap = {
  '.test.json': 'tests',
  '.test.js': 'scriptTest',
  '.json': 'config',
  '.md': 'doc',
} as const;

function parseFile(file: string) {
  for (const [extension, fileType] of Object.entries(fileTypeMap)) {
    if (file.endsWith(extension)) {
      const fileName = file.slice(0, -extension.length);
      return {
        fileName,
        fileNameParts: fileName.split('/'),
        fileType,
      };
    }
  }
  throw new Error('never');
}

function buildCollectionsTree(
  flat: { file: string; content: string | JsonRecord }[],
) {
  const FS_REQUESTS = Symbol('fsRequests');

  type CollectionNode = {
    [FS_REQUESTS]?: Record<string, Record<string, JsonValue>>;
  } & Record<string, JsonValue>;

  const collections: Record<string, CollectionNode> = {};

  for (const { file, content } of flat) {
    const { fileType, fileNameParts } = parseFile(file);
    const collectionKey = fileNameParts[0];
    const collection = (collections[collectionKey] ??= {});

    if (
      fileNameParts.length === 1 ||
      (fileNameParts.length === 2 && fileNameParts[0] === fileNameParts[1])
    ) {
      if (fileType === 'config') {
        Object.assign(collection, content);
      } else {
        collection[fileType] = content;
      }
      continue;
    }

    const requestKey = fileNameParts[1];
    const fsRequests = (collection[FS_REQUESTS] ??= {});
    const request = (fsRequests[requestKey] ??= {});

    if (fileType === 'config') {
      Object.assign(request, content);
    } else {
      request[fileType] = content;
    }
  }

  return Object.values(collections).map(
    ({ [FS_REQUESTS]: fsRequests, requests, ...rest }) => {
      return {
        ...rest,
        requests: [
          ...(Array.isArray(requests) ? requests : []),
          ...(fsRequests ? Object.values(fsRequests) : []),
        ],
      };
    },
  );
}

export async function readWorkspaceFiles({
  dir,
  files: { config: configFile, collections: collectionFiles },
}: {
  dir: string;
  files: WorkspaceFiles;
}): Promise<WorkspaceResources> {
  dir = dir.replace(/\/$/, '');

  const configData = await readJsonRecord({
    dir,
    file: configFile,
  });

  const collectionsDir = `${dir}/${WORKSPACE_COLLECTIONS_DIR}`;

  const collectionsFlattenData = (
    await Promise.all(
      collectionFiles.map(async file => ({
        file,
        content: file.endsWith('.json')
          ? await readJsonRecord({ dir: collectionsDir, file })
          : await readPlainText({ dir: collectionsDir, file }),
      })),
    )
  ).filter(
    (e): e is { file: string; content: string | JsonRecord } =>
      e.content !== null,
  );

  return {
    config: configData ?? {},
    collections: buildCollectionsTree(collectionsFlattenData),
  };
}
