export enum ERROR_CODES {
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export const ERROR_MESSAGES = {
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
};

export function getErorrMessage(errorCode: ERROR_CODES): string {
  return ERROR_MESSAGES[errorCode];
}
