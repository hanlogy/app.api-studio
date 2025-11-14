import type { JsonValue, RequestHeaders, RequestMethod } from '@/definitions';

export type HttpRequest = {
  method: RequestMethod;
  url: string;
  headers?: RequestHeaders;
  body?: JsonValue;
};

export type HttpResponse = {
  headers?: RequestHeaders;
  status: number;
  body?: JsonValue | ArrayBuffer;
  requestTime: number;
  responseTime: number;
};
