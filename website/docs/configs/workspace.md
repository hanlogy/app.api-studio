---
sidebar_position: 1
---

# Workspace

A **workspace configuration file** defines the core settings for your Api Studio
workspace.  
It must be named **`config.json`** and placed in the **root folder** of the
workspace.

A complete example:

```json title="config.json"
{
  "name": "My Workspace",
  "description": "This is my workspace",
  "environments": {
    "@global": {
      ":host": "https://example.com",
      "headers": {
        "Content-Type": "application/json"
      }
    },
    "dev": {
      ":host": "https://dev.example.com",
      ":authorization": "",
      "headers": {
        "Authorization": "{{authorization}}"
      }
    }
  }
}
```

## `name`

**Required** - The name of the workspace.

## `description`

**Optional** - A short summary or note describing the workspace.

## `environments`

Defines environment configurations for the workspace. You can define multiple
environments such as `@global`, `dev`, `staging`, or `prod`.

- The **`@global`** environment is automatically applied to all requests.
- Other environments can override or extend the global settings.

### `headers`

Headers are defined as **key-value pairs**. They apply to all requests made
within the selected environment.

Example:

```json
"headers": {
  "Authorization": "Bearer {{token}}",
  "Content-Type": "application/json"
}
```

### Variables

Variables start with a **colon (`:`)**, for example `:host`. They can be
referenced using **`{{variableName}}`** syntax within the same scope or child
levels.

Example:

```json
{
  ":host": "https://dev.example.com",
  ":loginApi": "{{host}}/login",
  "headers": {
    "from": "{{loginApi}}"
  }
}
```

All variables can be reassigned at run-time using `requestMiddleware.js`.
