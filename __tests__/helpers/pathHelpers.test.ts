import {
  joinPath,
  getDirFromFilePath,
  normalizePath,
  resolvePath,
} from '@/helpers/pathHelpers';

describe('getDirFromFilePath', () => {
  test('simple file path', () => {
    expect(getDirFromFilePath('data/config.json')).toBe('data');
  });

  test('duplicated slash', () => {
    expect(getDirFromFilePath('data///config.json')).toBe('data');
  });

  test('absolute path', () => {
    expect(getDirFromFilePath('/var/log/app.log')).toBe('/var/log');
  });
});

describe('normalizePath', () => {
  test('simple', () => {
    expect(normalizePath('///data////config////')).toBe('/data/config');
  });
});

describe('resolvePath', () => {
  test('simple path', () => {
    expect(
      resolvePath({
        absoluteDir: '/var/log',
        relativePath: 'app.log',
      }),
    ).toBe('/var/log/app.log');
  });

  test('current directory "."', () => {
    expect(
      resolvePath({
        absoluteDir: '/var/log',
        relativePath: './app.log',
      }),
    ).toBe('/var/log/app.log');
  });

  test('single ".."', () => {
    expect(
      resolvePath({
        absoluteDir: '/var/log/users',
        relativePath: '../website.txt',
      }),
    ).toBe('/var/log/website.txt');
  });

  test('multiple ".."', () => {
    expect(
      resolvePath({
        absoluteDir: '/var/log/users',
        relativePath: '../../website.txt',
      }),
    ).toBe('/var/website.txt');
  });

  test('go beyond root', () => {
    expect(
      resolvePath({
        absoluteDir: '/',
        relativePath: '../website.txt',
      }),
    ).toBe('/website.txt');
  });

  test('normalizes extra slashes', () => {
    expect(
      resolvePath({
        absoluteDir: '/var//log///',
        relativePath: 'app.log',
      }),
    ).toBe('/var/log/app.log');
  });

  test('empty relativePath', () => {
    expect(
      resolvePath({
        absoluteDir: '/var/log',
        relativePath: '',
      }),
    ).toBe('/var/log');
  });

  test('ignore leading slashes in relativePath', () => {
    expect(
      resolvePath({
        absoluteDir: '/var/log/',
        relativePath: '///users/app.log',
      }),
    ).toBe('/var/log/users/app.log');
  });
});

describe('joinPath', () => {
  test('string parts', () => {
    expect(joinPath('api', 'v1', 'users')).toBe('api/v1/users');
  });

  test('array overload', () => {
    expect(joinPath(['api', 'v1', 'users'])).toBe('api/v1/users');
  });

  test('numbers', () => {
    expect(joinPath('users', 123, 'profile')).toBe('users/123/profile');
  });

  test('normalization', () => {
    expect(joinPath('api/', '/v1/', '/users/')).toBe('api/v1/users');
  });

  test('empty input', () => {
    expect(joinPath([])).toBe('');
  });

  it('filters invalid', () => {
    expect(joinPath(['api', '', 'v1', ''])).toBe('api/v1');
  });
});
