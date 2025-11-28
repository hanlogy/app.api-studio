import { normalizePath } from '@/lib/HttpServer/simpleHelpers';

describe('normalizePath', () => {
  test('emtpy input', () => {
    expect(normalizePath('')).toStrictEqual({
      path: '',
      segments: [''],
    });
  });

  test('/ input', () => {
    expect(normalizePath('/')).toStrictEqual({
      path: '',
      segments: [''],
    });
  });

  test('with leading and tailing slash, and duplicated slash', () => {
    expect(normalizePath('//hello//world//123///')).toStrictEqual({
      path: 'hello/world/123',
      segments: ['hello', 'world', '123'],
    });
  });
});
