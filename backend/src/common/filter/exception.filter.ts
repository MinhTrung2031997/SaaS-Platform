/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { InternalException } from '../exception';
import { HttpApiResponse } from '../utils/api-http.response';
import { Observable } from 'rxjs';

/**
 * Internal exception filter
 * Gets an InternalException in code and creates an error response
 */
@Catch()
export class DefaultInternalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: AbstractHttpAdapter) {}

  catch(
    exception: InternalException,
    host: ArgumentsHost,
  ): Observable<HttpApiResponse<any>> {
    return httpInternalExceptionHandler(
      this.httpAdapter,
      host.switchToHttp(),
      exception,
    );
  }
}

/**
 * Unhandle error exception filter
 * Gets an Unhandle Exception in code and creates an error response
 */

function httpInternalExceptionHandler(
  httpAdapter: AbstractHttpAdapter,
  context: HttpArgumentsHost,
  exception: InternalException,
): any {
  const responseBody = HttpApiResponse.failed(
    exception?.response?.statusCode ?? exception.code,
    exception?.response?.message ?? exception.message,
  );
  httpAdapter.reply(context.getResponse(), responseBody, 500);
  return null;
}
