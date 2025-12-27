import { AppError } from '@/definitions';

describe('AppError', () => {
  test('with code', () => {
    const err = new AppError({ code: 'foo' });

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
    expect(err.toJSON()).toStrictEqual({
      name: 'AppError',
      code: 'foo',
      message: '',
    });
  });

  test('with message and data', () => {
    const data = { a: 1 };
    const err = new AppError({ code: 'foo', message: 'wrong', data });

    expect(err.toJSON()).toStrictEqual({
      name: 'AppError',
      code: 'foo',
      message: 'wrong',
      data,
    });
  });
});
