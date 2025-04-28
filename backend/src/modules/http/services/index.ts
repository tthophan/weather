export * from './internal-http.service';
export * from './external-http.service'

export const SINGLE_INTERNAL_HTTP_CLIENT = Symbol(
  'SINGLE_INTERNAL_HTTP_CLIENT',
);
