import {
  Injectable,
  Logger as CoreLogger,
  LoggerService,
} from '@nestjs/common';
@Injectable()
export class Logger extends CoreLogger implements LoggerService {
  constructor(name?: string) {
    super(name ?? Logger.name);
  }
  // TODO override
  log(message: any, context?: string): void;
  log(message: any, ...optionalParams: any[]): void;
  log(message: unknown, context?: unknown, ...rest: unknown[]): void {
    console.log(JSON.stringify({ type: 'info', message, context, ...rest }));
  }
  info(message: any, context?: string): void;
  info(message: any, ...optionalParams: any[]): void;
  info(message: unknown, context?: unknown, ...rest: unknown[]): void {
    console.log(JSON.stringify({ type: 'info', message, context, ...rest }));
  }
  warn(message: any, context?: string): void;
  warn(message: any, ...optionalParams: any[]): void;
  warn(message: unknown, context?: unknown, ...rest: unknown[]): void {
    console.log(JSON.stringify({ type: 'warn', message, context, ...rest }));
  }
  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...optionalParams: any[]): void;
  error(
    message: unknown,
    stack?: unknown,
    context?: unknown,
    ...rest: unknown[]
  ): void {
    console.log(
      JSON.stringify({ type: 'error', message, stack, context, ...rest }),
    );
  }
}
