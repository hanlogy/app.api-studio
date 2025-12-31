import { AppError } from '@/definitions';
import { isSameError } from '@/repositories/loadProject/isSameError';

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
});
