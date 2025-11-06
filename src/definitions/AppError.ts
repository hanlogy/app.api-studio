export class AppError extends Error {
  constructor({ code, message }: { code: string; message: string }) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }

  readonly code: string;

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
    };
  }

  toString() {
    return JSON.stringify(this);
  }
}
