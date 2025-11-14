---
sidebar_position: 1
---

:::warning Caution

You **must** call `await api.send()` explicitly in a middleware function and
**return the response**.  
Otherwise, the request will not be triggered.

:::

# Request Middleware

A **Request Middleware** runs during a request's lifecycle.  
It gives you full control over how a request is handled before, during, and
after it is sent.

The middleware file must be named **`requestMiddleware.js`** and placed inside
the `/scripts` folder.

Example:

```js
async function middleware(key, requestParams, api) {
  const response = await api.send();

  if (api.isKey(key, ['login', 'user'])) {
    const token = response.body.accessToken;
    api.setEnvironmentVariable('authorization', `Bearer ${token}`);
  }

  return response;
}
```

## Function Declaration

- The file must have **only one function**.
- The function can have **any name**, but it must be **`async`**.

## Parameters

### `key`

The identifier for the current request. A `key` is a combination of the
request's `id` and the collection's `id`. For example: `['login', 'user']`,
where:

- `login` - a request `id`
- `user` - a collection `id`

### `requestParams`

The resolved request parameters. Type definition:

```ts
interface HttpRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
}
```

You can mutate the parameters directly, for example:

```js
requestParams.url += '?limit=50';
```

### `api`

A helper object that provides control over requests and environments.

#### `send()`

You **must** call this method explicitly to trigger the actual request.

#### `isKey(key1, key2)`

```ts
isKey(key1: string | [string, string], key2: string | [string, string]): boolean
```

Checks if two keys refer to the same request.

#### `setEnvironmentVariable(name, value)`

Sets a variable for the **currently selected environment**.

```ts
setEnvironmentVariable(
  name: string,
  value: number | string | boolean | null
): void
```

#### `setGlobalEnvironmentVariable(name, value)`

Sets a variable in the **global environment**.

```ts
setGlobalEnvironmentVariable(
  name: string,
  value: number | string | boolean | null
): void
```

#### `setRequestVariable(key, name, value)`

Sets a variable for a specific request.

```ts
setRequestVariable(
  key: RequestResourceKey,
  name: string,
  value: PrimitiveValue
): void
```

## Return Value

You **must** return the response object explicitly.

```ts
interface HttpResponse {
  headers?: RequestHeaders;
  status: number;
  body?: JsonValue | ArrayBuffer;
  requestTime: number;
  responseTime: number;
}
```
