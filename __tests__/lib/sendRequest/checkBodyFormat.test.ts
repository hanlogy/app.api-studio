import { checkBodyFormat } from '@/lib/sendHttpRequest/checkBodyFormat';

describe('checkBodyFormat', () => {
  describe('input is a Headers object', () => {
    test('no content-type', () => {
      expect(checkBodyFormat(new Headers())).toBe('unknown');
    });

    test('case-insensitive when check type, but keep the orginal in headers', () => {
      expect(
        checkBodyFormat(
          new Headers({
            'CONTENT-TYPE': 'APPLICATION/JSON',
          }),
        ),
      ).toBe('json');
    });
  });

  describe('input is a plain object', () => {
    test('no content-type', () => {
      expect(checkBodyFormat({})).toBe('unknown');
    });

    test('case-insensitive when check type, but keep the orginal in headers', () => {
      expect(
        checkBodyFormat({
          'CONTENT-TYPE': 'APPLICATION/JSON',
        }),
      ).toBe('json');
    });
  });
});
