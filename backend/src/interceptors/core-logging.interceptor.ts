import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from 'src/modules/loggers';
import { formatMilliseconds } from 'src/utils';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const requestContext = request.context;

    this.logger.info(
      `Accepted Request [${requestContext.cid}] - ${request.url} - ${request.method}`,
      {
        ...requestContext,
        method: request.method,
        url: request.url,
      },
    );

    return next.handle().pipe(
      tap(() =>
        this.logger.info(
          `Response [${requestContext.cid}] - [${response.statusCode}]: ${formatMilliseconds(new Date().getTime() - requestContext.requestTimestamp)}`,
          requestContext,
        ),
      ),
      catchError((err) => {
        this.logger.error(
          `$Exception  [${requestContext.cid}] - [${response.statusCode}]: ${formatMilliseconds(new Date().getTime() - requestContext.requestTimestamp)}`,
          {
            status: err.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            cid: requestContext.cid,
            stackTraces: err.stack,
          },
        );
        return throwError(() => err);
      }),
    );
  }
}
