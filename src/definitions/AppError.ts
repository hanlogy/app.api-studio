export class AppError<T = unknown> extends Error {
  constructor({
    code,
    message,
    data,
  }: {
    code: string;
    message?: string;
    data?: T;
  }) {
    super(message);
    this.code = code;
    this.data = data;
    this.name = 'AppError';
  }

  readonly code: string;
  readonly data?: T;

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      ...(this.data !== undefined ? { data: this.data } : {}),
    };
  }

  toString() {
    return JSON.stringify(this);
  }
}
