---
sidebar_position: 2
---

# Collection Config

A **collection** defines a group of API requests and their shared environment.  
Collection config files must be placed inside the `/collections` folder.  
Each file can have any name with a `.json` extension.

Example:

```json title="user.json"
{
  "id": "user",
  "name": "User",
  "baseUrl": "{{host}}/{{version}}",
  "headers": {
    "platform": "ios"
  },
  ":version": "v1",
  ":email": "test@example.com",
  ":password": "1234",
  "requests": [
    {
      "id": "login",
      "name": "Login",
      "url": "login",
      "method": "POST",
      "body": {
        "email": "{{email}}",
        "password": "{{password}}"
      }
    },
    {
      "name": "Signup",
      "url": "signup",
      "method": "POST",
      "body": {
        "email": "{{email}}",
        "password": "{{password}}"
      }
    }
  ]
}
```

## `id`

**Optional** - Required only if you plan to reference this collection in scripts
at run-time. If omitted, **Api Studio** automatically uses the lowercased `name`
as the `id`.

## `name`

**Required** - The display name of the collection.

## `baseUrl`

**Optional** — Prepends to all request URLs within this collection. For example,
if a request's `url` is `login` and the `baseUrl` is `https://example.com`, the
final URL will be `https://example.com/login`.

## `headers`

**Optional** — Defines default headers for all requests in the collection. These
headers merge with and override the environment-level headers.

### Variables

Variables start with a **colon (`:`)**, for example `:host`. They can be
referenced using **`{{variableName}}`** within the same or child scopes. Order
doesn't matter - you can reference a variable before it's defined.

Example:

```json
{
  "baseUrl": "{{baseUrl}}",
  ":baseUrl": "https://dev.example.com/{{version}}",
  ":version": "v1",
  "headers": {
    "from": "{{baseUrl}}"
  }
}
```

All variables can be reassigned at run-time using `requestMiddleware.js`.

## `requests`

A list of request definitions. See [Request config](/docs/configs/request) for
details.
