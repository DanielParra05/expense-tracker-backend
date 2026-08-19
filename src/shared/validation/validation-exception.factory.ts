import type { ValidationError as ClassValidatorError } from 'class-validator';
import { RequestValidationError } from '../errors/request-validation.error';
import { FieldErrorCode } from '../errors/shared-error-code';

export function validationExceptionFactory(
  errors: ClassValidatorError[],
): RequestValidationError {
  return new RequestValidationError(toFieldCodes(errors, ''));
}

function toFieldCodes(
  errors: readonly ClassValidatorError[],
  parentPath: string,
): Record<string, FieldErrorCode> {
  const fields: Record<string, FieldErrorCode> = {};

  for (const error of errors) {
    const path =
      parentPath === '' ? error.property : `${parentPath}.${error.property}`;
    const constraint = firstConstraint(error);

    if (constraint !== undefined) {
      fields[path] = toFieldErrorCode(constraint);
    }

    if (error.children !== undefined && error.children.length > 0) {
      Object.assign(fields, toFieldCodes(error.children, path));
    }
  }

  return fields;
}

function firstConstraint(error: ClassValidatorError): string | undefined {
  if (error.constraints === undefined) {
    return undefined;
  }
  return Object.keys(error.constraints)[0];
}

function toFieldErrorCode(constraint: string): FieldErrorCode {
  switch (constraint) {
    case 'isNotEmpty':
      return FieldErrorCode.REQUIRED;
    case 'isEmail':
      return FieldErrorCode.INVALID_EMAIL;
    case 'isString':
      return FieldErrorCode.INVALID_TYPE;
    case 'maxLength':
      return FieldErrorCode.TOO_LONG;
    case 'minLength':
      return FieldErrorCode.TOO_SHORT;
    case 'whitelistValidation':
      return FieldErrorCode.UNKNOWN_FIELD;
    default:
      return FieldErrorCode.INVALID;
  }
}
