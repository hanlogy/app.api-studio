const inspect = Symbol.for('nodejs.util.inspect.custom');

type MetaKind = 'primitive' | 'array' | 'object' | 'function';

function metaKind(value: unknown): MetaKind {
  const type = typeof value;

  if (
    value === null ||
    value === undefined ||
    ['string', 'number', 'boolean', 'bigint', 'symbol'].includes(type)
  ) {
    return 'primitive';
  }

  if (type === 'function') {
    return 'function';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  //  Date, Map, Set, class instances, plain objects, etc.
  return 'object';
}

export interface AppErrorProps<T> {
  code: string;
  message?: string;
  meta?: T;
}

export class AppError<T = unknown> extends Error {
  constructor({ code, message, meta }: AppErrorProps<T>) {
    super(message);
    this.code = code;
    this.meta = meta;
    this.name = 'AppError';
  }

  readonly code: string;
  readonly meta?: T;

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      ...(this.meta !== undefined ? { meta: this.meta } : {}),
    };
  }

  toString() {
    return JSON.stringify(this);
  }

  [inspect]() {
    return this.toString();
  }

  sameAs(other: unknown) {
    if (
      !(other instanceof AppError) ||
      this.code !== other.code ||
      this.message !== other.message ||
      this.name !== other.name
    ) {
      return false;
    }

    const metaA = this.meta;
    const metaB = other.meta;

    const metaKindA = metaKind(metaA);
    const metaKindB = metaKind(metaB);

    if (metaKindA !== metaKindB) {
      return false;
    }

    if (metaKindA === 'primitive') {
      return Object.is(metaA, metaB);
    }

    return true;
  }

  static from<T = unknown>(
    error?: unknown,
    override?: Partial<AppErrorProps<T>>,
  ): AppError<T> {
    const base: AppErrorProps<T> =
      error instanceof AppError
        ? {
            code: error.code,
            message: error.message,
            meta: error.meta as T,
          }
        : {
            code: 'unknown',
            message: error instanceof Error ? error.message : String(error),
          };

    return new AppError<T>({ ...base, ...(override ?? {}) });
  }
}
