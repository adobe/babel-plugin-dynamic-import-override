# babel-plugin-dynamic-import-override

Babel plugin to override every dynamic import in application by attaching success and error handler.

## Goals

To override all lazy-loaded chunks in an application from a single file, babel.config.js (or .babelrc), eliminating the need to manually override every chunk.

## Installation

```sh
npm install -D babel-plugin-dynamic-import-override
```

```sh
yarn add -D babel-plugin-dynamic-import-override
```

### Options

- *`errorHandler`* - error object is accesible in `err`.

- *`successHandler`* - result is accesible in `res`.

*NOTE:* successHandler and errorHandler should be wrapped as string.
Dynamic Import that has failed/succeeded can be accessed via following variables: [Refer: [example](./example)]
  - `importNode` - Contains full code of dynamic import.
      Example: `import('./Home.js')`
  - `importName` - Contains file name of dynamic import.
      Example: `./Home.js`

### Skip Overriding Dynamic Import

To skip overriding some dynamic imports, use following magic comment in the dynamic imports

```javascript
/* skipImportOverride: true */
```

## Usage

### Via `babel.config.js` (Recommended)

**babel.config.js**

```javascript
module.exports = function (api) {
  api.cache(true);

  const plugins = [
    ["babel-plugin-dynamic-import-override", {
      "successHandler": `console.log('inside success handler, perform success handling here, result is available in res');
        console.log(res);`,
      "errorHandler": `console.log('inside error handler, perform error handling here, error is available in err');
        console.log(err);`
    }]
  ];

  return {
    presets,
    plugins
  };
}
```

**.babelrc**

```json
{
  "plugins": [
    ["babel-plugin-dynamic-import-override", {
      "successHandler": "console.log('inside success handler, perform success handling here, result is available in res', res);",
      "errorHandler": "console.log('inside error handler, perform error handling here, error is available in err', err);"
    }]
  ]
}
```

## Example

### Example 1:

```javascript
import('./Home.js');
```

will be converted to,

```javascript
Promise.resolve(import('./Home.js'))
.then(res => {
  // --- successhandler code will come here ----
  return res;
})
.catch(err => {
  // --- errorhandler code will come here ----
  throw err;
});
```

Any `.catch` and `.then` attached to dynamic import will stay as it is and will not be replaced.


```javascript
import('./Home.js')
.then(data => console.log(data))
.catch(err => {throw err;});
```

will be converted to,

```javascript
Promise.resolve(import('./Home.js')
.then(data => console.log(data)) // Original then handler
.then(res => {
  // --- successhandler code will come here ----
  return res;
})
.catch(err => {throw err;})) // Original catch handler
.catch(err => {
  // --- errorhandler code will come here ----
  throw err;
});
```

### Example 2: Skip Overriding Dynamic Imports

If you want to skip following dynamic import to not override,

```javascript
import('./Home.js');
```

Change it to following,
```javascript
import(/* skipImportOverride: true */ './Home.js');
`````

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
