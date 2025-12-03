import { parsePath } from '@/lib/HttpServer/simpleHelpers';

describe('parsePath', () => {
  test('emtpy input', () => {
    expect(parsePath('')).toStrictEqual({
      path: '',
      segments: [''],
    });
  });

  test('/ input', () => {
    expect(parsePath('/')).toStrictEqual({
      path: '',
      segments: [''],
    });
  });

  test('with leading and tailing slash, and duplicated slash', () => {
    expect(parsePath('//hello//world//123///')).toStrictEqual({
      path: 'hello/world/123',
      segments: ['hello', 'world', '123'],
    });
  });
});
