# babel-plugin-dynamic-import-override

Babel plugin that overrides every dynamic import and provides a way to attach successHandler and errorhandler to all dynamic imports. Thus providing error handling and success handling when chunk loading will fail or succeed.

## Installation

```sh
npm install -D babel-plugin-dynamic-import-override
```

```sh
yarn add -D babel-plugin-dynamic-import-override
```

#### Options

- *`errorHandler`* - javascript code to be called inside catch clause, error object is accesible in `err`.

- *`successHandler`* - javascript code to be called inside then clause, result  is accesible in `res`.

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
