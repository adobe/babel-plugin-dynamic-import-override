// babel.config.js

const errorHandler = require('./errorHandler.js');
const successHandler = require('./successHandler.js');

module.exports = function (api) {
  api.cache(true);

  const presets = [];
  const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    ['dynamic-import-override', {
      errorHandler: errorHandler(),
      successHandler: successHandler()
    }]
  ];

  return {
    presets,
    plugins
  };
}
