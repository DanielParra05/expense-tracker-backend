import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { SharedErrorCode } from '../errors/shared-error-code';
import type { ErrorResponse } from './error-response';
import { sendError } from './send-error';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';
const RECORD_NOT_FOUND = 'P2025';
const FOREIGN_KEY_VIOLATION = 'P2003';

type ClientFacingError = {
  readonly status: HttpStatus;
  readonly body: ErrorResponse;
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter<Prisma.PrismaClientKnownRequestError> {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const { status, body } = toClientFacingError(exception.code);

    this.logger.error({
      msg: body.code,
      statusCode: status,
      prismaCode: exception.code,
    });

    sendError(host, status, body);
  }
}

function toClientFacingError(prismaCode: string): ClientFacingError {
  switch (prismaCode) {
    case UNIQUE_CONSTRAINT_VIOLATION:
      return {
        status: HttpStatus.CONFLICT,
        body: {
          code: SharedErrorCode.RESOURCE_ALREADY_EXISTS,
          message: 'Resource already exists',
        },
      };
    case RECORD_NOT_FOUND:
      return {
        status: HttpStatus.NOT_FOUND,
        body: {
          code: SharedErrorCode.RESOURCE_NOT_FOUND,
          message: 'Resource not found',
        },
      };
    case FOREIGN_KEY_VIOLATION:
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          code: SharedErrorCode.RELATED_RESOURCE_NOT_FOUND,
          message: 'Related resource does not exist',
        },
      };
    default:
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          code: SharedErrorCode.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      };
  }
}
