---
sidebar_position: 3
---

# Request Config

A **request config** defines a single API request within a **collection**.

Example:

```json
{
  "id": "create_profile",
  "name": "Create profile",
  "url": "https://example.com/profile",
  "method": "POST",
  ":language": "en",
  "query": {
    "format": "tree"
  },
  "headers": {
    "locale": "{{language}}_US"
  },
  "body": {
    "name": "Foo",
    "level": 1,
    "language": "{{language}}"
  }
}
```

## `id`

**Optional** - Required only if you plan to reference this request in scripts at
run-time. If omitted, **Api Studio** automatically uses the lowercased `name` as
the `id`.

## `name`

**Required** — The display name of the request.

## `url`

**Required** — The full or relative request URL. If `baseUrl` is defined in the
collection, it will automatically prepend to this value.

## `method`

**Required** — The HTTP method for the request, such as `GET`, `POST`, `PUT`,
`PATCH`, or `DELETE`.

## `query`

**Optional** — Defines query parameters as key–value pairs that will be appended
to the URL.

Example:

```json
"query": {
  "limit": 10,
  "offset": 0
}
```

## `headers`

**Optional** — Custom headers for the request. These merge with and override
headers defined at the collection or environment level.

## `body`

**Optional** — Defines the request body for methods like `POST`, `PUT`, or
`PATCH`. Supports JSON, form, and raw text formats depending on the request
type.

## Variables

Variables start with a **colon (`:`)** and can be referenced using
**`{{variableName}}`** syntax. They can be used in any part of the request —
URL, headers, query, or body.

Example:

```json
{
  ":language": "en",
  "headers": {
    "locale": "{{language}}_US"
  },
  "body": {
    "language": "{{language}}"
  }
}
```

All variables can be reassigned at run-time using `requestMiddleware.js`.
