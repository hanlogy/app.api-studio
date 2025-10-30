export class StudioError extends Error {
  constructor({code, message}: {code: string; message?: string}) {
    super(message);
    this.code = code;
    this.name = 'StudioError';
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

  static fromCode(code: string) {
    return new StudioError({code});
  }

  /**
   * @deprecated "do not use it"
   */
  static invalidSource(name: string, source: unknown) {
    return new StudioError({
      code: 'invalidSource',
      message: `${name}: ${source} is not a valid source`,
    });
  }
}
