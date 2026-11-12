import {
  IS_EMAIL,
  IS_INT,
  IS_ISO8601,
  IS_NOT_EMPTY,
  IS_NUMBER,
  IS_STRING,
  IS_UUID,
  MATCHES,
  MAX,
  MAX_LENGTH,
  MIN,
  MIN_LENGTH,
  type ValidationError as ClassValidatorError,
} from 'class-validator';
import { RequestValidationError } from '../errors/request-validation.error';
import { FieldErrorCode } from '../errors/shared-error-code';

const WHITELIST_CONSTRAINT = 'whitelistValidation';

type ConstraintRule = {
  readonly code: FieldErrorCode;
  // Lower wins: a wrong type is reported before a wrong format, before a wrong range.
  readonly priority: number;
};

const TYPE_PRIORITY = 0;
const FORMAT_PRIORITY = 1;
const LIMIT_PRIORITY = 2;
const UNKNOWN_PRIORITY = 3;

const CONSTRAINT_RULES: Readonly<Record<string, ConstraintRule>> = {
  [IS_STRING]: { code: FieldErrorCode.INVALID_TYPE, priority: TYPE_PRIORITY },
  [IS_INT]: { code: FieldErrorCode.INVALID_TYPE, priority: TYPE_PRIORITY },
  [IS_NUMBER]: { code: FieldErrorCode.INVALID_TYPE, priority: TYPE_PRIORITY },
  [IS_NOT_EMPTY]: { code: FieldErrorCode.REQUIRED, priority: FORMAT_PRIORITY },
  [IS_EMAIL]: {
    code: FieldErrorCode.INVALID_EMAIL,
    priority: FORMAT_PRIORITY,
  },
  [IS_UUID]: { code: FieldErrorCode.INVALID_ID, priority: FORMAT_PRIORITY },
  [IS_ISO8601]: {
    code: FieldErrorCode.INVALID_FORMAT,
    priority: FORMAT_PRIORITY,
  },
  [MATCHES]: {
    code: FieldErrorCode.INVALID_FORMAT,
    priority: FORMAT_PRIORITY,
  },
  [MIN]: { code: FieldErrorCode.OUT_OF_RANGE, priority: LIMIT_PRIORITY },
  [MAX]: { code: FieldErrorCode.OUT_OF_RANGE, priority: LIMIT_PRIORITY },
  [MIN_LENGTH]: { code: FieldErrorCode.TOO_SHORT, priority: LIMIT_PRIORITY },
  [MAX_LENGTH]: { code: FieldErrorCode.TOO_LONG, priority: LIMIT_PRIORITY },
};

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
    const code = toFieldErrorCode(error);

    if (code !== undefined) {
      fields[path] = code;
    }

    if (error.children !== undefined && error.children.length > 0) {
      Object.assign(fields, toFieldCodes(error.children, path));
    }
  }

  return fields;
}

function toFieldErrorCode(
  error: ClassValidatorError,
): FieldErrorCode | undefined {
  const constraintNames = Object.keys(error.constraints ?? {});
  if (constraintNames.length === 0) {
    return undefined;
  }
  if (constraintNames.includes(WHITELIST_CONSTRAINT)) {
    return FieldErrorCode.UNKNOWN_FIELD;
  }
  if (error.value === undefined || error.value === null) {
    return FieldErrorCode.REQUIRED;
  }

  const [highestPriorityRule] = constraintNames
    .map(toRule)
    .sort((first, second) => first.priority - second.priority);
  return highestPriorityRule.code;
}

function toRule(constraintName: string): ConstraintRule {
  return (
    CONSTRAINT_RULES[constraintName] ?? {
      code: FieldErrorCode.INVALID,
      priority: UNKNOWN_PRIORITY,
    }
  );
}
