import { getExtension } from '@/helpers/fileHelpers';

describe('getExtension', () => {
  test('returns lowercase extension, keeps leading dot', () => {
    expect(getExtension('foo.JPG')).toBe('jpg');
    expect(getExtension('tar.PdF')).toBe('pdf');
  });

  test('multi-dot filenames', () => {
    expect(getExtension('foo.tar.gz')).toBe('gz');
    expect(getExtension('a.b.c')).toBe('c');
    expect(getExtension('a..b')).toBe('b');
  });

  test('no dot', () => {
    expect(getExtension('filename')).toBeUndefined();
  });

  test('the dot is the first character', () => {
    expect(getExtension('.env')).toBeUndefined();
  });

  test('trailing dot', () => {
    expect(getExtension('file.')).toBeUndefined();
  });

  test('with paths', () => {
    expect(getExtension('/path/to/file.TXT')).toBe('txt');
    expect(getExtension('C:\\path\\to\\file.zip')).toBe('zip');
  });
});
