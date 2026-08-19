export abstract class DomainError extends Error {
  // Never read from a base constructor: initializers run after super() returns.
  abstract readonly code: string;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Error.captureStackTrace(this, new.target);
  }
}
