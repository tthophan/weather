import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {
  AUTHORIZATION,
  CID_HEADER_KEY,
  DEVICE_ID_HEADER_KEY,
  LANGUAGE_CODE_HEADER_KEY,
} from 'src/constants';
import { RequestContext } from 'src/models';
import { generateCID } from 'src/utils';
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor() {}
  use(request: Request, _: Response, next: NextFunction) {
    const cid =
      request.header(CID_HEADER_KEY) ||
      request.header(CID_HEADER_KEY.toUpperCase());
    const deviceId =
      request.header(DEVICE_ID_HEADER_KEY) ||
      request.header(DEVICE_ID_HEADER_KEY.toUpperCase());
    const lang =
      request.header(LANGUAGE_CODE_HEADER_KEY) ||
      request.header(LANGUAGE_CODE_HEADER_KEY.toUpperCase());
    request.context = new RequestContext({
      cid: generateCID(cid),
      deviceId,
      lang,
      requestTimestamp: this.getTimestamp(),
    });

    const accessToken =
      request.header(AUTHORIZATION) ||
      request.header(AUTHORIZATION.toUpperCase());
    if (accessToken) {
      try {
        const token = accessToken.split(' ')[1];
        const userInfo = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString(),
        );
        request.context.userInfo = userInfo;
      } catch (error) {
        console.warn('Error parsing user info', error);
      }
    }

    next();
  }

  getTimestamp = () => new Date().getTime();
}
