export abstract class BaseException extends Error {
  code: number;
  response?: { message?: string; statusCode?: number };

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}
