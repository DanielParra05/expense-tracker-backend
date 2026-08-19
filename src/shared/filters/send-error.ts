import type { ArgumentsHost, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import type { ErrorResponse } from './error-response';

export function sendError(
  host: ArgumentsHost,
  status: HttpStatus,
  body: ErrorResponse,
): void {
  host.switchToHttp().getResponse<Response>().status(status).json(body);
}
