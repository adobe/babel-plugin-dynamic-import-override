# babel-plugin-dynamic-import-override

Babel plugin that overrides every dynamic import and provides a way to attach successHandler and errorhandler to all dynamic imports. Thus providing error handling and success handling when chunk loading will fail or succeed.
It also provides way to skip some dynamic imports from overriding.

## Goals

There might be some scenarios where you want to take some action when any chunk fails to load in an application. Since, all the lazy-loaded chunks in a application are loaded by dynamic import, an easy way can be to override all dynamic imports of application and attaching errorHandler to all dynamic imports. This way you need not to ask module developer to change all the dynamic imports manually and change can be driven from single file, babel config.

## Installation

```sh
npm install -D babel-plugin-dynamic-import-override
```

```sh
yarn add -D babel-plugin-dynamic-import-override
```

### Options

- *`errorHandler`* - javascript code to be called inside catch clause, error object is accesible in `err`.

- *`successHandler`* - javascript code to be called inside then clause, result  is accesible in `res`.

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

Any .catch and .then attached to dynamic import will stay as it is and will not be replaced.

```javascript
import('./Home.js').then(data => console.log(data)).catch(err => {throw err;});
```

will be converted to,

```javascript
Promise.resolve(import('./Home.js')
.then(data => console.log(data))
.then(res => {
  // --- successhandler code will come here ----
  return res;
})
.catch(err => {throw err;}))
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
