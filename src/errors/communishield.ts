export abstract class CommunishieldError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(
      this,
      this.constructor.prototype as Record<string, unknown>,
    );
  }
}
