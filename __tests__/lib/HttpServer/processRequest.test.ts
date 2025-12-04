import type { MockServerCase, MockServerRoute } from '@/definitions';
import { createTextResponse } from '@/lib/HttpServer/createResponses';
import type {
  ServerRequest,
  ServerResponse,
} from '@/lib/HttpServer/definitions';
import { forwardRequest } from '@/lib/HttpServer/forwardRequest';
import { matchRequestCase } from '@/lib/HttpServer/matchRequestCase';
import { matchRoute } from '@/lib/HttpServer/matchRoute';
import { processRequest } from '@/lib/HttpServer/processRequest';

jest.mock('@/lib/HttpServer/matchRoute');
jest.mock('@/lib/HttpServer/createResponses');
jest.mock('@/lib/HttpServer/matchRequestCase');
jest.mock('@/lib/HttpServer/forwardRequest');

const mockedMatchRoute = jest.mocked(matchRoute);
const mockedCreateTextResponse = jest.mocked(createTextResponse);
const mockedMatchRequestCase = jest.mocked(matchRequestCase);
const mockedForwardRequest = jest.mocked(forwardRequest);

function makeRequest(overrides: Partial<ServerRequest> = {}): ServerRequest {
  return {
    method: 'GET',
    path: 'users',
    rawPath: '/users',
    headers: {},
    body: '',
    ...overrides,
  };
}

function makeRoute(overrides: Partial<MockServerRoute> = {}): MockServerRoute {
  return {
    order: 0,
    name: 'route',
    method: 'GET',
    path: '/users',
    delay: undefined,
    cases: [],
    ...overrides,
  } as MockServerRoute;
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe('processRequest', () => {
  test('returns 404 when no route matches', async () => {
    const request = makeRequest();
    const routes: MockServerRoute[] = [];

    const textResponse = {
      status: 404,
      headers: { 'content-type': 'text/plain' },
      body: 'no route',
    };

    mockedMatchRoute.mockReturnValue(undefined as any);
    mockedCreateTextResponse.mockReturnValue(textResponse);

    const result = await processRequest({
      request,
      routes,
      globalHeaders: { 'x-tar': '1' },
    });

    expect(mockedMatchRoute).toHaveBeenCalledWith(routes, {
      method: 'GET',
      path: 'users',
    });

    expect(mockedCreateTextResponse).toHaveBeenCalledWith({
      status: 404,
      body: expect.any(String),
    });

    expect(result.delay).toBeUndefined();
    expect(result.response).toBe(textResponse);
  });

  test('returns 404 when no case matches', async () => {
    const request = makeRequest();
    const route = makeRoute({ cases: [] });
    const routes = [route];

    const textResponse = {
      status: 404,
      headers: { 'content-type': 'text/plain' },
      body: 'no case',
    };

    mockedMatchRoute.mockReturnValue({
      route,
      pathParams: { id: '1' },
    } as any);

    mockedCreateTextResponse.mockReturnValue(textResponse);

    const result = await processRequest({
      request,
      routes,
    });

    expect(mockedMatchRoute).toHaveBeenCalledTimes(1);
    expect(mockedMatchRequestCase).not.toHaveBeenCalled();
    expect(mockedCreateTextResponse).toHaveBeenCalledWith({
      status: 404,
      body: 'No mock case for GET /users',
    });
    expect(result.response).toBe(textResponse);
  });

  test('attaches pathParams and forwards when forward case matches', async () => {
    const request = makeRequest({
      method: 'POST',
      path: 'users/john',
      rawPath: '/users/john',
    });

    const forwardCase = {
      delay: 150,
      forward: 'https://api.example.com/user/{{params.name}}',
    };

    const route = makeRoute({
      path: '/users/:name',
      delay: 50,
      cases: [forwardCase],
    });
    const routes = [route];

    const forwardResponse: ServerResponse = {
      status: 201,
      headers: { 'x-upstream': '1' },
      body: 'created',
    };

    mockedMatchRoute.mockReturnValue({
      route,
      pathParams: { name: 'john' },
    } as any);

    mockedMatchRequestCase.mockReturnValue(true);
    mockedForwardRequest.mockResolvedValue(forwardResponse);

    const result = await processRequest({
      request,
      routes,
    });

    // ensure pathParams passed into matchRequestCase
    expect(mockedMatchRequestCase).toHaveBeenCalledTimes(1);
    const callArg = mockedMatchRequestCase.mock.calls[0][0];
    expect(callArg.request.pathParams).toEqual({ name: 'john' });

    // delay uses selectedCase.delay (150) over route.delay (50)
    expect(result.delay).toBe(150);
    expect(mockedForwardRequest).toHaveBeenCalledWith({
      template: 'https://api.example.com/user/{{params.name}}',
      request: expect.objectContaining({
        method: 'POST',
        path: 'users/john',
        rawPath: '/users/john',
        pathParams: { name: 'john' },
      }),
    });
    expect(result.response).toBe(forwardResponse);
  });

  test('static response with merged headers and json object body', async () => {
    const request = makeRequest();

    const caseBody = { foo: 'bar', n: 1 };
    const responseCase = {
      delay: 200,
      response: {
        status: 201,
        headers: { 'x-foo': '1' },
        body: caseBody,
      },
    };

    const route = makeRoute({
      delay: 50,
      cases: [responseCase],
    });
    const routes = [route];

    mockedMatchRoute.mockReturnValue({
      route,
      pathParams: {},
    } as any);

    mockedMatchRequestCase.mockReturnValue(true);

    const result = await processRequest({
      request,
      routes,
      globalHeaders: { 'content-type': 'application/json', 'x-tar': 'g' },
    });

    // selectedCase.delay wins
    expect(result.delay).toBe(200);
    expect(result.response.status).toBe(201);
    expect(result.response.body).toBe(JSON.stringify(caseBody));

    expect(result.response.headers).toEqual({
      'content-type': 'application/json',
      'x-tar': 'g',
      'x-foo': '1',
    });
  });

  test('returns static response with plain string body unchanged', async () => {
    const request = makeRequest();

    const responseCase = {
      response: {
        status: 200,
        headers: { 'x-foo': '1' },
        body: 'hello world',
      },
    };

    const route = makeRoute({
      cases: [responseCase],
    });
    const routes = [route];

    mockedMatchRoute.mockReturnValue({
      route,
      pathParams: {},
    });

    mockedMatchRequestCase.mockReturnValue(true);

    const result = await processRequest({
      request,
      routes,
      globalHeaders: { 'x-tar': 'g' },
    });

    expect(result.delay).toBeUndefined();
    expect(result.response.status).toBe(200);
    expect(result.response.body).toBe('hello world');
    expect(result.response.headers).toEqual({
      'x-tar': 'g',
      'x-foo': '1',
    });
  });

  test('returns 500 when case has neither forward nor response', async () => {
    const request = makeRequest();

    const badCase: MockServerCase = {
      delay: 10,
      request: {},
    };

    const route = makeRoute({
      cases: [badCase],
    });
    const routes = [route];

    const errorResponse: ServerResponse = {
      status: 500,
      headers: { 'content-type': 'text/plain' },
      body: 'bad case',
    };

    mockedMatchRoute.mockReturnValue({
      route,
      pathParams: {},
    });

    mockedMatchRequestCase.mockReturnValue(true);
    mockedCreateTextResponse.mockReturnValue(errorResponse);

    const result = await processRequest({
      request,
      routes,
    });

    expect(result.delay).toBeUndefined();
    expect(mockedCreateTextResponse).toHaveBeenCalledWith({
      status: 500,
      body: expect.any(String),
    });
    expect(result.response).toBe(errorResponse);
  });
});
