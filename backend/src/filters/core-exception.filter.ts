import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core';
import { Request, Response } from 'express';
import _ from 'lodash';
import {
  CID_HEADER_KEY,
  CONTENT_TYPE_HEADER_KEY,
  MODULE_OPTIONS_TOKEN,
} from 'src/constants';
import { BusinessException } from 'src/exceptions';
import { ConfigModuleOptions, InvalidParam } from 'src/interfaces';
import { ErrorResponse } from 'src/models';
import { formatMilliseconds } from 'src/utils';

type ExceptionResponse =
  | {
      data?: unknown;
      statusCode: number;
      message: string | string[];
      error: string;
    }
  | string;
@Catch()
@Injectable()
export class CoreExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly registerOption: ConfigModuleOptions,
  ) {}

  /**
   * Handles exceptions thrown in the NestJS application and returns an appropriate error response.
   * @param exception - The exception object that was thrown.
   * @param host - The host object that contains the request and response objects.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let errorMessage: string;
    let errorCode: string;
    let invalidParams: InvalidParam[] | undefined;
    if (exception instanceof BusinessException) {
      const bizException = exception as BusinessException;
      response.status(bizException.status);
      errorMessage = bizException?.errorMessage;
      errorCode = bizException?.errorCode;
    } else if ((exception as any) instanceof BadRequestException) {
      const badRequestException = exception as BadRequestException;
      const message = (badRequestException.getResponse() as any).message;
      if (message && Array.isArray(message)) {
        invalidParams = message.map((msg) => {
          return {
            name: msg.split(' ')[0],
            reason: msg,
          };
        });
      } else {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'INVALID_REQUEST';
      }
      response.status(400);
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse() as ExceptionResponse;
      if (typeof res === 'object' && Array.isArray(res.message)) {
        const { message } = res;
        errorMessage = _.first(message);
      } else if (typeof res === 'object' && typeof res.message === 'string') {
        errorMessage = res.message;
      } else if (typeof res === 'string') {
        errorMessage = res;
      }
      response.status(exception.getStatus());
    } else {
      // Primsa not found error
      const notFoundError = exception as any;
      if (notFoundError.code === 'P2025') {
        response.status(404);
      } else {
        response.status(500);
      }
    }

    const resData = new ErrorResponse({
      timestamp: request.context?.requestTimestamp,
      responseTime: this.calculateResponseTime(
        request.context?.requestTimestamp,
      ),
      detail: errorMessage ?? this.getErrorMessage(exception),
      title: errorCode,
      instance: request.url,
      status: response.statusCode,
      invalidParams: invalidParams,
    });

    response.header(CID_HEADER_KEY, request.context?.cid || '');
    response.header(CONTENT_TYPE_HEADER_KEY, 'application/problem+json');
    response.json(resData);

    return resData;
  }

  /**
   * Gets the error message based on the environment and the exception's stack or message.
   * @param exception - The exception object.
   * @returns The error message.
   */
  private getErrorMessage(exception: HttpException): string {
    if (this.registerOption.env === 'development') {
      return exception?.stack ?? exception?.message ?? 'Internal Server Error';
    } else {
      return exception?.message;
    }
  }

  /**
   * Calculates the response time based on the given timestamp.
   * @param timestamp - The timestamp of the request.
   * @returns The formatted response time.
   */
  private calculateResponseTime(timestamp: number): string {
    const responseTime = new Date().getTime() - timestamp;
    return formatMilliseconds(responseTime);
  }
}
