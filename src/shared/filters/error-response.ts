import type { HttpStatus } from '@nestjs/common';
import type { FieldErrorCode } from '../errors/shared-error-code';

export type ErrorResponse = {
  readonly code: string;
  readonly message: string;
  readonly fields?: Readonly<Record<string, FieldErrorCode>>;
};

export type ClientFacingError = {
  readonly status: HttpStatus;
  readonly body: ErrorResponse;
};
