import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConflictError } from '../errors/conflict.error';
import { DomainError } from '../errors/domain.error';
import { NotFoundError } from '../errors/not-found.error';
import { RequestValidationError } from '../errors/request-validation.error';
import { ValidationError } from '../errors/validation.error';
import { sendError } from './send-error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter<DomainError> {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainError, host: ArgumentsHost): void {
    const status = toStatus(exception);

    this.logger.warn({ msg: exception.code, statusCode: status });

    sendError(host, status, {
      code: exception.code,
      message: exception.message,
      fields:
        exception instanceof RequestValidationError
          ? exception.fields
          : undefined,
    });
  }
}

function toStatus(error: DomainError): HttpStatus {
  if (error instanceof NotFoundError) {
    return HttpStatus.NOT_FOUND;
  }
  if (error instanceof ConflictError) {
    return HttpStatus.CONFLICT;
  }
  if (error instanceof ValidationError) {
    return HttpStatus.BAD_REQUEST;
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
}
