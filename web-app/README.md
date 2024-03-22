# Web App Mock Server Quick Guide

This guide provides quick steps to use the mock server with `json-server` for the web application.

## Quick Start

**Prerequisites:** Node.js and npm installed.

### Install JSON Server

- Globally: `npm install -g json-server`
- Locally: `npm install json-server --save-dev`

### Start Mock Server

```bash
json-server --watch json-server-mock-data.json

### NPM Script Shortcut

Add to `package.json`:

```json
"scripts": {
  "start-mock": "json-server --watch json-server-mock-data.json"
}

Then run:

`npm run start-mock`

### Mock Data File

- File Name: json-server-mock-data.json
- Purpose: Contains mock data for the API.

### Accessing Mock Data

Access mock data via http://localhost:3000/. For example, use /users to access user data.

### Editing Mock Data

Modify json-server-mock-data.json as needed to update mock data.
