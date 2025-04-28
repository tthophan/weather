import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AxiosError, AxiosHeaders, AxiosResponse, isAxiosError } from 'axios';
import { Request } from 'express';
import { ErrorResponse, SuccessResponse } from 'src/models';
import { HttpClientService } from './http-client.service';
import { BusinessException } from 'src/exceptions';
import {
  AUTHORIZATION,
  CID_HEADER_KEY,
  CONTENT_TYPE_HEADER_KEY,
  DEVICE_ID_HEADER_KEY,
  LANGUAGE_CODE_HEADER_KEY,
} from 'src/constants';

@Injectable()
export class InternalHttpClientService extends HttpClientService {
  constructor(
    @Inject(REQUEST)
    request: Request,
  ) {
    const options = {
      //   timeout: cfgDefault().httpRequestTimeout,
    };
    super(options, request);
  }

  protected override buildHeaders(
    headers: Record<string, string> | AxiosHeaders,
  ): AxiosHeaders {
    const axiosHeaders = new AxiosHeaders(headers);
    axiosHeaders.set(CONTENT_TYPE_HEADER_KEY, 'application/json');
    axiosHeaders.set(CID_HEADER_KEY, this.request?.context?.cid);
    this.request?.context?.accesstoken &&
      axiosHeaders.set(AUTHORIZATION, this.request?.context?.accesstoken);
    this.request?.context?.deviceId &&
      axiosHeaders.set(DEVICE_ID_HEADER_KEY, this.request?.context?.deviceId);
    this.request?.context?.lang &&
      axiosHeaders.set(LANGUAGE_CODE_HEADER_KEY, this.request?.context?.lang);

    return new AxiosHeaders(axiosHeaders);
  }

  protected override handleResponse<T>(
    res: AxiosResponse<T> | AxiosError<T>,
  ): T {
    if (isAxiosError(res)) {
      const errorResData = res?.response?.data as ErrorResponse;
      throw new BusinessException({
        errorCode: errorResData?.title ?? res.code,
        status: res?.response?.status ?? res?.status,
        errorMessage: errorResData?.detail,
      });
    } else if (res.status >= 200 && res.status < 300) {
      const successResData = res.data as SuccessResponse<T>;
      return successResData.data;
    }
  }
}
