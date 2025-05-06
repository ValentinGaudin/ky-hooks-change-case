<p>
  <a href="https://codecov.io/github/ValentinGaudin/ky-change-case-hooks">
    <img src="https://img.shields.io/codecov/c/github/ValentinGaudin/ky-change-case-hooks.svg?sanitize=true" alt="Coverage Status">
  </a>
</p>

# ky-change-case-hooks

Hooks to automatically transform the casing of request and response payloads when using the [ky](https://github.com/sindresorhus/ky) HTTP client.

> 🔄 This project is an **actively maintained fork** of [`@alice-health/ky-hooks-change-case`](https://github.com/alice-health/ky-hooks-change-case), originally developed by [@nfriend](https://github.com/nfriend) and unmaintained since 2023.  
> 🛠️ Maintained by [Valentin Gaudin](https://github.com/ValentinGaudin).  
> 📦 Published under the new name: `@valentingaudin/ky-change-case-hooks`

---
## Install

###### NPM

```bash
npm install @valentingaudin/ky-change-case-hooks
```

## Usage

```js
import ky from "ky";
import {
  requestToSnakeCase,
  responseToCamelCase,
} from "@valentingaudin/ky-change-case-hook";

ky.post(`${server.url}/path`, {
  json: { fooBar: true },
  hooks: {
    beforeRequest: [requestToSnakeCase],
    afterResponse: [responseToCamelCase],
  },
});
```

In the example above, the `requestToSnakeCase` method will convert the resquest body from `{fooBar: true}` to `{foo_bar: true}` and the response from `{response_body: false}` to `{responseBody: false}`. This way, the frontend and the backend API can each define their independent style guide.

## API

### Before request hooks

#### requestToSnakeCase

Convert the request body keys objects to `snake_case`.

#### requestToCamelCase

Convert the request body keys objects to `camelCase`.

#### requestToKebabCase

Convert the request body keys objects to `kebab-case`.

### After response hooks

#### responseToSnakeCase

Convert the response body keys objects to `snake_case`.

#### responseToCamelCase

Convert the response body keys objects to `camelCase`.

#### responseToKebabCase

Convert the response body keys objects to `kebab-case`.

## Browser support

The latest version of Chrome, Firefox, and Safari.

## Related

[ky](https://github.com/sindresorhus/ky) 🌳 Tiny & elegant HTTP client based on window.fetch
