import type { JsonRecord, JsonValue } from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import { resolvePath } from '@/helpers/pathHelpers';

export function collectExternalRefs(
  node: JsonRecord,
  baseDir: string,
): string[] {
  const out = new Set<string>();

  const walk = (input: JsonValue) => {
    if (!input) {
      return;
    }

    if (Array.isArray(input)) {
      for (const value of input) {
        walk(value);
      }
      return;
    }

    if (!isPlainObject(input)) {
      return;
    }

    // Spec-accurate: if $ref exists, ignore siblings.
    const ref = input.$ref;
    if (typeof ref === 'string') {
      const raw = ref.trim();

      const filePart = raw.split('#', 1)[0]?.trim() ?? '';
      if (filePart) {
        const isUrl = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(filePart);
        out.add(
          isUrl
            ? filePart
            : resolvePath({ absoluteDir: baseDir, relativePath: filePart }),
        );
      }

      // do not walk siblings
      return;
    }

    for (const value of Object.values(input)) {
      walk(value as JsonValue);
    }
  };

  walk(node);
  return [...out];
}
