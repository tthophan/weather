import { AxiosError, AxiosHeaders, AxiosResponse, isAxiosError } from "axios";
import { HttpClientService } from "./http-client.service";
import { ErrorResponse, SuccessResponse } from "./models";

export class InternalHttpClientService extends HttpClientService {
  constructor() {
    const options = {};
    super(options);
  }

  protected override buildHeaders(
    headers: Record<string, string> | AxiosHeaders
  ): AxiosHeaders {
    const axiosHeaders = new AxiosHeaders(headers);
    axiosHeaders.setContentType("application/json");
    axiosHeaders.setAccept("application/json");
    return new AxiosHeaders(axiosHeaders);
  }

  protected override handleResponse<T>(
    res: AxiosResponse<T> | AxiosError<T>
  ): T {
    if (isAxiosError(res)) {
      const errorResData = res?.response?.data as ErrorResponse;
      throw errorResData;
    } else if (res.status >= 200 && res.status < 300) {
      const successResData = res.data as SuccessResponse<T>;
      return successResData.data;
    }
    return res.data;
  }
}

const internalHttpClientService = new InternalHttpClientService();
export default internalHttpClientService;
