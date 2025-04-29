import { CoreResponse, InvalidParam } from "../interfaces/core-response.interface";

export class SuccessResponse<T>
  implements
    Omit<
      CoreResponse<T>,
      "title" | "detail" | "instance" | "status" | "invalidParams"
    >
{
  cid: string;
  timestamp: number;
  responseTime: string;
  data: T;
  constructor(data: Partial<SuccessResponse<T>>) {
    Object.assign(this, data);
  }
}

export class ErrorResponse implements Omit<CoreResponse, "data"> {
  cid: string;
  timestamp: number;
  responseTime: string;
  title: string;
  detail: string;
  instance: string;
  status: number;
  invalidParams: InvalidParam[];

  constructor(data: Partial<ErrorResponse>) {
    Object.assign(this, data);
  }
}
