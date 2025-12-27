import { getWatchedPaths } from '@/repositories/loadProject/getWatchedPaths';

type Doc = { path: string; externalRefs: string[] };

describe('getWatchedPaths', () => {
  test('all good', () => {
    const project = {
      projectDir: '/root',
      configPath: '/root/api_studio/config.json',
      entryPath: '/root/openapi.yaml',
      overlaysPaths: [
        '/root/overlays/a.yaml',
        '/root/overlays/b.yaml',
        'https://example.com/overlays/remote.yaml',
        'http://example.com/overlays/remote2.yaml',
      ],
      docs: new Map<string, Doc>([
        [
          '/root/openapi.yaml',
          {
            // duplicates entryPath
            path: '/root/openapi.yaml',
            externalRefs: [
              '/root/components.yaml',
              '/root/schemas.yaml',
              // duplicate ref
              '/root/schemas.yaml',
            ],
          },
        ],
        [
          '/root/paths.yaml',
          {
            path: '/root/paths.yaml',
            // duplicate across docs
            externalRefs: [
              '/root/components.yaml',
              'https://example.com/refs/remote-ref.yaml',
              'http://example.com/refs/remote-ref2.yaml',
            ],
          },
        ],
      ]),
      reverseDeps: new Map<string, string[]>(),
    };

    const out = getWatchedPaths(project as any);

    expect(new Set(out)).toStrictEqual(
      new Set([
        '/root/api_studio/config.json',
        '/root/openapi.yaml',
        '/root/overlays/a.yaml',
        '/root/overlays/b.yaml',
        '/root/paths.yaml',
        '/root/components.yaml',
        '/root/schemas.yaml',
      ]),
    );

    // Ensure it actually deduped
    expect(out.length).toBe(new Set(out).size);
  });

  test('handles empty overlays and empty docs', () => {
    const project = {
      projectDir: '/root',
      configPath: '/root/api_studio/config.json',
      entryPath: '/root/openapi.yaml',
      overlaysPaths: [],
      docs: new Map<string, Doc>(),
      reverseDeps: new Map<string, string[]>(),
    };

    const out = getWatchedPaths(project as any);

    expect(new Set(out)).toEqual(
      new Set(['/root/api_studio/config.json', '/root/openapi.yaml']),
    );
  });
});
