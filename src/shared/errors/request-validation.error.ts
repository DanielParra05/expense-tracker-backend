import { type FieldErrorCode, SharedErrorCode } from './shared-error-code';
import { ValidationError } from './validation.error';

export class RequestValidationError extends ValidationError {
  readonly code: SharedErrorCode = SharedErrorCode.VALIDATION_FAILED;
  readonly fields: Readonly<Record<string, FieldErrorCode>>;

  constructor(fields: Readonly<Record<string, FieldErrorCode>>) {
    super('Request validation failed');
    this.fields = fields;
  }
}
