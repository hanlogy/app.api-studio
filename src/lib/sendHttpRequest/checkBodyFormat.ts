// This format is used to tell how to render the content.
export type BodyFormat =
  | 'json'
  | 'text'
  | 'html'
  | 'xml'
  | 'image'
  | 'audio'
  | 'video'
  | 'pdf'
  | 'unknown'
  | 'other';

export function checkBodyFormat(
  headers: Headers | Record<string, string>,
): BodyFormat {
  let contentTypeRaw: string | null | undefined;

  const fieldName = 'content-type';

  if (headers instanceof Headers) {
    contentTypeRaw = headers.get(fieldName);
  } else {
    contentTypeRaw = Object.entries(headers).find(
      ([key]) => key.toLowerCase() === fieldName,
    )?.[1];
  }

  if (!contentTypeRaw) {
    return 'unknown';
  }
  contentTypeRaw = contentTypeRaw.toLowerCase();

  if (contentTypeRaw.includes('application/json')) {
    return 'json';
  }

  if (contentTypeRaw.includes('text/plain')) {
    return 'text';
  }

  if (contentTypeRaw.includes('text/html')) {
    return 'html';
  }

  return 'other';
}
