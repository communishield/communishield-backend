export abstract class CommunishieldError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CommunishieldError.prototype);
  }
}
