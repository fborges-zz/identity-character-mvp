export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UPSTREAM_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(
    message: string,
    opts: { code: ErrorCode; statusCode: number; details?: unknown }
  ) {
    super(message);
    this.name = "AppError";
    this.code = opts.code;
    this.statusCode = opts.statusCode;
    this.details = opts.details;
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

