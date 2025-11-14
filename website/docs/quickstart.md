---
sidebar_position: 1
---

# Quickstart

## 1. Create a Workspace Folder

Your workspace should have the following structure:

```text
/
├── config.json
├── collections/
│   ├── collection-1.json
│   ├── collection-2.json
│   └── collection-N.json
└── scripts/
    └── requestMiddleware.js
```

A workspace **must include** a `config.json` file. Other files and folders are
optional and can be added later. **Api Studio** automatically reads new files in
real time.

### config.json

This file defines the workspace configuration. It must:

- Be named **`config.json`**
- Contain at least a **`name`** field

```json title="config.json"
{
  "name": "My Workspace"
}
```

## 2. Open the Workspace

Launch **Api Studio**, click **"Open Workspace..."**, and select the folder you
just created.

## 3. Next Steps

Check out the [Configs](/docs/category/configs) to learn how to create workspace
config, collections, and requests.
