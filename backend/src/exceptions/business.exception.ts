import { HttpStatus } from '@nestjs/common';

type ExceptionType = {
  errorCode: string;
  errorMessage?: string;
  status: HttpStatus;
  data?: any;
};
export class BusinessException {
  readonly errorCode: string;
  readonly errorMessage: string;
  readonly status?: HttpStatus;
  readonly data?: any;

  constructor({ errorCode, errorMessage, data = '', status }: ExceptionType) {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage || 'Internal Server Error';
    this.status = status || HttpStatus.INTERNAL_SERVER_ERROR;
    this.data = data;
  }
}
