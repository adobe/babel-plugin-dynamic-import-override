const generator = require('@babel/generator').default;

module.exports = function({template}) {
  return {
    visitor: {
      CallExpression(path, state) {
        if(path.node.callee.type == 'Import' && path.node.callee.loc) {
          let importNode = generator(path.node).code;
          // Skip overriding dynamic import if skipImportOverride is mentioned in magic comment
          let skipOverrideStart = importNode.indexOf('skipImportOverride');
          if (skipOverrideStart > -1) {
            let skipOverride = importNode.substring(skipOverrideStart);
            skipOverride = skipOverride.substring(0, skipOverride.indexOf('*/'));
            skipOverride = skipOverride.split(':');
            if (skipOverride[1].trim() !== "true") {
              return;
            }
          }
          let newImport = `Promise.resolve(${importNode}).then((res) => {${state.opts.successHandler}; return res;}).catch((err) => {${state.opts.errorHandler}; throw err;})`;
          let newProgramNode = template(newImport, {
            plugins: ["dynamicImport"],
            preserveComments: true
          })();
          path.replaceWith(newProgramNode);
        }
      }
    }
  };
};