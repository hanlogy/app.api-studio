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

  test('with message and meta', () => {
    const meta = { a: 1 };
    const err = new AppError({ code: 'foo', message: 'wrong', meta });

    expect(err.toJSON()).toStrictEqual({
      name: 'AppError',
      code: 'foo',
      message: 'wrong',
      meta,
    });
  });

  describe('AppError.from', () => {
    test('clones from AppError', () => {
      const original = new AppError({
        code: 'bad_request',
        message: 'Invalid input',
        meta: { field: 'email' },
      });

      const created = AppError.from(original);

      expect(created).toBeInstanceOf(AppError);
      expect(created).not.toBe(original);
      expect(created.name).toBe('AppError');
      expect(created.code).toBe('bad_request');
      expect(created.message).toBe('Invalid input');
      expect(created.meta).toEqual({ field: 'email' });
    });

    test('from normal Error', () => {
      const created = AppError.from(new Error('Boom'));

      expect(created).toBeInstanceOf(AppError);
      expect(created.code).toBe('unknown');
      expect(created.message).toBe('Boom');
      expect(created.meta).toBeUndefined();
    });

    test('from non-Error', () => {
      expect(AppError.from('nope').message).toBe('nope');
      expect(AppError.from(123).message).toBe('123');
      expect(AppError.from(null).message).toBe('null');
      expect(AppError.from(undefined).message).toBe('undefined');
    });

    test('overrides AppError', () => {
      const original = new AppError({
        code: 'bad_request',
        message: 'Invalid input',
        meta: { field: 'email' },
      });

      const created = AppError.from(original, {
        code: 'override_code',
        message: 'Override message',
        meta: { field: 'password' },
      });

      expect(created.code).toBe('override_code');
      expect(created.message).toBe('Override message');
      expect(created.meta).toEqual({ field: 'password' });
    });

    test('override regular Error', () => {
      const created = AppError.from(new Error('Boom'), {
        code: 'server_error',
        meta: { traceId: 't-1' },
      });

      expect(created.code).toBe('server_error');
      expect(created.message).toBe('Boom');
      expect(created.meta).toEqual({ traceId: 't-1' });
    });
  });

  describe('AppError.sameAs', () => {
    test('code/message/name match and both meta are equal primitives', () => {
      const a = new AppError({ code: 'c', message: 'm', meta: 1 });
      const b = new AppError({ code: 'c', message: 'm', meta: 1 });

      expect(a.sameAs(b)).toBe(true);
    });

    test('code differs', () => {
      const a = new AppError({ code: 'a', message: 'm', meta: 1 });
      const b = new AppError({ code: 'b', message: 'm', meta: 1 });

      expect(a.sameAs(b)).toBe(false);
    });

    test('message differs', () => {
      const a = new AppError({ code: 'c', message: 'm1', meta: 1 });
      const b = new AppError({ code: 'c', message: 'm2', meta: 1 });

      expect(a.sameAs(b)).toBe(false);
    });

    test('name differs', () => {
      const a = new AppError({ code: 'c', message: 'm', meta: 1 });
      const b = new AppError({ code: 'c', message: 'm', meta: 1 });

      (b as any).name = 'OtherError';
      expect(a.sameAs(b)).toBe(false);
    });

    test('other is not an AppError', () => {
      const a = new AppError({ code: 'c', message: 'm', meta: 1 });

      expect(a.sameAs(new Error('m'))).toBe(false);
      expect(a.sameAs({ code: 'c', message: 'm', meta: 1 })).toBe(false);
    });

    describe('meta kind rules', () => {
      test('undefined vs undefined', () => {
        const a = new AppError({ code: 'c', message: 'm' });
        const b = new AppError({ code: 'c', message: 'm' });

        expect(a.sameAs(b)).toBe(true);
      });

      test('undefined vs object', () => {
        const a = new AppError({ code: 'c', message: 'm' });
        const b = new AppError({ code: 'c', message: 'm', meta: {} });

        expect(a.sameAs(b)).toBe(false);
      });

      test('null vs null', () => {
        const a = new AppError({ code: 'c', message: 'm', meta: null });
        const b = new AppError({ code: 'c', message: 'm', meta: null });

        expect(a.sameAs(b)).toBe(true);
      });

      test('null vs undefined', () => {
        const a = new AppError({ code: 'c', message: 'm', meta: null });
        const b = new AppError({ code: 'c', message: 'm' });

        expect(a.sameAs(b)).toBe(false);
      });

      test('object vs object (no deep compare)', () => {
        const a = new AppError({
          code: 'c',
          message: 'm',
          meta: { path: '/a' },
        });
        const b = new AppError({
          code: 'c',
          message: 'm',
          meta: { path: '/b' },
        });

        expect(a.sameAs(b)).toBe(true);
      });

      test('array vs array (no deep compare)', () => {
        const a = new AppError({ code: 'c', message: 'm', meta: [1, 2, 3] });
        const b = new AppError({ code: 'c', message: 'm', meta: ['x'] });

        expect(a.sameAs(b)).toBe(true);
      });

      test('object vs array', () => {
        const a = new AppError({ code: 'c', message: 'm', meta: { x: 1 } });
        const b = new AppError({ code: 'c', message: 'm', meta: [1, 2] });

        expect(a.sameAs(b)).toBe(false);
      });

      test('function vs function', () => {
        const a = new AppError({ code: 'c', message: 'm', meta: () => 1 });
        const b = new AppError({
          code: 'c',
          message: 'm',
          meta: function () {},
        });

        expect(a.sameAs(b)).toBe(true);
      });

      test('function vs object', () => {
        const a = new AppError({ code: 'c', message: 'm', meta: () => 1 });
        const b = new AppError({ code: 'c', message: 'm', meta: {} });

        expect(a.sameAs(b)).toBe(false);
      });

      test('Date vs Date', () => {
        const a = new AppError({ code: 'c', message: 'm', meta: new Date(0) });
        const b = new AppError({
          code: 'c',
          message: 'm',
          meta: new Date(999),
        });

        expect(a.sameAs(b)).toBe(true);
      });
    });
  });
});
