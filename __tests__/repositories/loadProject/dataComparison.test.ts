import { AppError } from '@/definitions';
import {
  isSameError,
  isSameProjectData,
} from '@/repositories/loadProject/dataComparison';
import type {
  ApiStudioProject,
  ConfigDocument,
  OpenApiDocument,
} from '@/repositories/loadProject/types';

jest.mock('@/helpers/checkTypes', () => ({
  isPlainObject: (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value),
}));

describe('isSameError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('same', () => {
    const errorA = new AppError({
      code: 'A',
      meta: {
        path: 'foo',
      },
    });

    const errorB = new AppError({
      code: 'A',
      meta: {
        path: 'foo',
      },
    });

    expect(isSameError(errorA, errorB)).toBe(true);
  });

  test('not same', () => {
    const errorA = new AppError({
      code: 'A',
      meta: {
        path: '1',
      },
    });

    const errorB = new AppError({
      code: 'A',
      meta: {
        path: '2',
      },
    });

    expect(isSameError(errorA, errorB)).toBe(false);
  });

  test('null values', () => {
    const error = new AppError({
      code: 'A',
      meta: {
        path: '1',
      },
    });
    expect(isSameError(null, null)).toBe(true);
    expect(isSameError(error, null)).toBe(false);
    expect(isSameError(null, error)).toBe(false);
  });
});

describe('isSameProjectData', () => {
  test('same reference', () => {
    const p = project();
    expect(isSameProjectData(p, p)).toBe(true);
  });

  test('null equality', () => {
    expect(isSameProjectData(null, null)).toBe(true);
    expect(isSameProjectData(project(), null)).toBe(false);
    expect(isSameProjectData(null, project())).toBe(false);
  });

  test('all match', () => {
    const a = project();
    const b = project({
      // new instances but same values
      overlayPaths: ['/p/overlay1.json'],
      docs: new Map(a.docs),
      reverseDeps: new Map(
        Array.from(a.reverseDeps.entries()).map(([k, s]) => [k, new Set(s)]),
      ),
    });

    expect(isSameProjectData(a, b)).toBe(true);
  });

  test('projectDir differs', () => {
    const a = project();
    const b = project({ projectDir: '/other' });
    expect(isSameProjectData(a, b)).toBe(false);
  });

  test('overlayPaths differ in length', () => {
    const a = project();
    const b = project({ overlayPaths: [] });
    expect(isSameProjectData(a, b)).toBe(false);
  });

  test('overlayPaths differ in content', () => {
    const a = project();
    const b = project({ overlayPaths: ['/p/overlay2.json'] });
    expect(isSameProjectData(a, b)).toBe(false);
  });

  test('docs size differs', () => {
    const a = project();
    const fewerDocs = new Map(a.docs);
    fewerDocs.delete('/p/overlay1.json');
    const b = project({ docs: fewerDocs });
    expect(isSameProjectData(a, b)).toBe(false);
  });

  test('a doc key is missing in B', () => {
    const a = project();
    const docsB = new Map(a.docs);
    docsB.delete('/p/openapi.json');
    // keep size same by adding some other key
    docsB.set('/p/other.json', doc('/p/other.json', 2, 'h2'));
    const b = project({ docs: docsB });

    expect(isSameProjectData(a, b)).toBe(false);
  });

  test('a doc mtime differs', () => {
    const a = project();
    const docsB = new Map(a.docs);
    const d = docsB.get('/p/openapi.json');
    if (!d) {
      throw new Error('Missing /p/openapi.json in docs');
    }

    docsB.set('/p/openapi.json', { ...d, mtime: d.mtime + 1 });

    const b = project({ docs: docsB });
    expect(isSameProjectData(a, b)).toBe(false);
  });

  test('a doc hash differs', () => {
    const a = project();
    const docsB = new Map(a.docs);
    const d = docsB.get('/p/openapi.json');
    if (!d) {
      throw new Error('Missing /p/openapi.json in docs');
    }
    docsB.set('/p/openapi.json', { ...d, hash: 'DIFFERENT' });

    const b = project({ docs: docsB });
    expect(isSameProjectData(a, b)).toBe(false);
  });

  test('reverseDeps size differs', () => {
    const a = project();
    const b = project({
      reverseDeps: new Map<string, ReadonlySet<string>>([
        ['/p/openapi.json', new Set(['/p/overlay1.json'])],
      ]),
    });
    expect(isSameProjectData(a, b)).toBe(false);
  });

  test('reverseDeps key missing in B', () => {
    const a = project();
    const reverseB = new Map(a.reverseDeps);
    reverseB.delete('/p/overlay1.json');
    reverseB.set('/p/other.json', new Set());

    const b = project({ reverseDeps: reverseB });
    expect(isSameProjectData(a, b)).toBe(false);
  });

  test('reverseDeps set differs', () => {
    const a = project();
    const reverseB = new Map<string, ReadonlySet<string>>([
      ['/p/openapi.json', new Set()], // differs
      ['/p/overlay1.json', new Set()],
    ]);

    const b = project({ reverseDeps: reverseB });
    expect(isSameProjectData(a, b)).toBe(false);
  });

  test('reverseDeps: order does not matter', () => {
    const a = project();
    const reverseB = new Map<string, ReadonlySet<string>>([
      ['/p/overlay1.json', new Set()],
      ['/p/openapi.json', new Set(['/p/overlay1.json'])],
    ]);

    const b = project({ reverseDeps: reverseB });
    expect(isSameProjectData(a, b)).toBe(true);
  });
});

function configDoc(
  path: string,
  mtime: number,
  hash: string,
  openapi = 'openapi.json',
  overlays: readonly string[] = [],
): ConfigDocument {
  return {
    path,
    type: 'json',
    text: 'ignored in equality',
    json: { openapi, overlays },
    mtime,
    hash,
  };
}

function doc(path: string, mtime: number, hash: string): OpenApiDocument {
  return {
    path,
    type: 'json',
    text: 'ignored in equality',
    json: {},
    mtime,
    hash,
  };
}

function project(overrides: Partial<ApiStudioProject> = {}): ApiStudioProject {
  const defaults: ApiStudioProject = {
    projectDir: '/p',
    configPath: '/p/api-studio/config.json',
    entryPath: '/p/openapi.json',
    overlayPaths: ['/p/overlay1.json'],
    docs: new Map<string, ConfigDocument | OpenApiDocument>([
      [
        '/p/api-studio/config.json',
        configDoc('/p/api-studio/config.json', 1, 'h1'),
      ],
      ['/p/openapi.json', doc('/p/openapi.json', 2, 'h2')],
      ['/p/overlay1.json', doc('/p/overlay1.json', 3, 'h3')],
    ]),
    reverseDeps: new Map<string, ReadonlySet<string>>([
      ['/p/openapi.json', new Set(['/p/overlay1.json'])],
      ['/p/overlay1.json', new Set()],
    ]),
  };

  return {
    ...defaults,
    ...overrides,
    docs: overrides.docs ?? defaults.docs,
    reverseDeps: overrides.reverseDeps ?? defaults.reverseDeps,
  };
}
