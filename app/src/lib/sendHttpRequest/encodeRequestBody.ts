import type { JsonValue } from '@/definitions';
import type { BodyFormat } from './checkBodyFormat';

// TODO: Support more types
export function encodeRequestBody({
  source,
  format,
}: {
  source?: JsonValue;
  format: BodyFormat;
}): BodyInit_ | undefined {
  if (source === undefined) {
    return undefined;
  }

  if (format === 'json') {
    return JSON.stringify(source);
  }

  return String(source);
}
