import { readJsonRecord, readPlainText } from '@/helpers/fileIO';
import type { WorkspaceFiles } from './types';
import {
  WORKSPACE_COLLECTIONS_DIR,
  WORKSPACE_SERVERS_DIR,
  type JsonRecord,
  type JsonValue,
  type WorkspaceSource,
} from '@/definitions';
import { parseRequestFileName } from './helpers';
import { resolveFilePlaceholders } from './resolveFilePlaceholders';
import { getDirFromFilePath, joinPath } from '@/helpers/pathHelpers';

function buildCollectionsTree(
  flat: readonly { file: string; content: string | JsonRecord }[],
) {
  const FS_REQUESTS = Symbol('fsRequests');

  type CollectionNode = {
    [FS_REQUESTS]?: Record<string, Record<string, JsonValue>>;
  } & Record<string, JsonValue>;

  const collections: Record<string, CollectionNode> = {};

  for (const { file, content } of flat) {
    const { fileType, fileNameParts } = parseRequestFileName(file);
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

function buildServersTree(
  flat: readonly { file: string; content: JsonRecord }[],
) {
  const FS_ROUTES = Symbol('fsRoutes');

  type ServerNode = {
    [FS_ROUTES]?: Record<string, Record<string, JsonValue>>;
  } & Record<string, JsonValue>;

  const servers: Record<string, ServerNode> = {};

  for (const { file, content } of flat) {
    const fileNameParts = file.slice(0, -'.json'.length).split('/');
    const serverKey = fileNameParts[0];
    const server = (servers[serverKey] ??= {});

    if (
      fileNameParts.length === 1 ||
      (fileNameParts.length === 2 && fileNameParts[0] === fileNameParts[1])
    ) {
      Object.assign(server, content);
      continue;
    }

    const routeKey = fileNameParts[1];
    const fsRoutes = (server[FS_ROUTES] ??= {});
    const route = (fsRoutes[routeKey] ??= {});

    Object.assign(route, content);
  }

  return Object.values(servers).map(
    ({ [FS_ROUTES]: fsRoutes, routes, ...rest }) => {
      return {
        ...rest,
        routes: [
          ...(Array.isArray(routes) ? routes : []),
          ...(fsRoutes ? Object.values(fsRoutes) : []),
        ],
      };
    },
  );
}

async function readJsonRecordAndResolveFile({
  dir,
  file,
}: {
  readonly dir: string;
  readonly file: string;
}) {
  const content = await readJsonRecord(joinPath(dir, file));
  if (!content) {
    return content;
  }

  return await resolveFilePlaceholders({
    baseDir: getDirFromFilePath(`${dir}/${file}`),
    content,
  });
}

export async function readWorkspaceFiles({
  dir,
  files: {
    config: configFile,
    collections: collectionFiles,
    servers: serverFiles,
  },
}: {
  readonly dir: string;
  readonly files: WorkspaceFiles;
}): Promise<WorkspaceSource> {
  dir = dir.replace(/\/$/, '');

  const configData = await readJsonRecordAndResolveFile({
    dir,
    file: configFile,
  });

  const collectionsDir = `${dir}/${WORKSPACE_COLLECTIONS_DIR}`;

  const collectionsFlattenData = (
    await Promise.all(
      collectionFiles.map(async file => ({
        file,
        content: file.endsWith('.json')
          ? await readJsonRecordAndResolveFile({ dir: collectionsDir, file })
          : await readPlainText(`${collectionsDir}/${file}`),
      })),
    )
  ).filter(
    (e): e is { file: string; content: string | JsonRecord } =>
      e.content !== null,
  );

  const serversDir = `${dir}/${WORKSPACE_SERVERS_DIR}`;

  const serversFlattenData = (
    await Promise.all(
      serverFiles.map(async file => ({
        file,
        content: await readJsonRecordAndResolveFile({ dir: serversDir, file }),
      })),
    )
  ).filter(
    (e): e is { file: string; content: JsonRecord } => e.content !== null,
  );

  return {
    config: configData ?? {},
    collections: buildCollectionsTree(collectionsFlattenData),
    servers: buildServersTree(serversFlattenData),
  };
}
