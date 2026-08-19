import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { inspect } from 'node:util';
import { SharedErrorCode } from '../errors/shared-error-code';
import { sendError } from './send-error';

const EXCEPTION_INSPECT_DEPTH = 3;
// A number, not HttpStatus: getStatus() returns a plain number.
const SERVER_ERROR_THRESHOLD = 500;

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof HttpException) {
      this.catchHttpException(exception, host);
      return;
    }

    this.logger.error(
      {
        msg: SharedErrorCode.INTERNAL_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        detail: describeException(exception),
      },
      exception instanceof Error ? exception.stack : undefined,
    );

    sendError(host, HttpStatus.INTERNAL_SERVER_ERROR, {
      code: SharedErrorCode.INTERNAL_ERROR,
      message: 'Internal server error',
    });
  }

  private catchHttpException(
    exception: HttpException,
    host: ArgumentsHost,
  ): void {
    const status = exception.getStatus();
    const code = toTransportCode(status);

    if (status >= SERVER_ERROR_THRESHOLD) {
      this.logger.error({ msg: code, statusCode: status }, exception.stack);
    } else {
      // 4xx is expected client traffic, not a system event.
      this.logger.debug({ msg: code, statusCode: status });
    }

    sendError(host, status, { code, message: exception.message });
  }
}

function toTransportCode(status: HttpStatus): SharedErrorCode {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return SharedErrorCode.BAD_REQUEST;
    case HttpStatus.UNAUTHORIZED:
      return SharedErrorCode.UNAUTHORIZED;
    case HttpStatus.FORBIDDEN:
      return SharedErrorCode.FORBIDDEN;
    case HttpStatus.NOT_FOUND:
      return SharedErrorCode.NOT_FOUND;
    case HttpStatus.METHOD_NOT_ALLOWED:
      return SharedErrorCode.METHOD_NOT_ALLOWED;
    case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
      return SharedErrorCode.UNSUPPORTED_MEDIA_TYPE;
    case HttpStatus.TOO_MANY_REQUESTS:
      return SharedErrorCode.TOO_MANY_REQUESTS;
    default:
      return SharedErrorCode.INTERNAL_ERROR;
  }
}

function describeException(exception: unknown): string {
  if (exception instanceof Error) {
    return `${exception.name}: ${exception.message}`;
  }
  return inspect(exception, { depth: EXCEPTION_INSPECT_DEPTH });
}
