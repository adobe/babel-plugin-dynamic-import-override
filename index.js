const generator = require('@babel/generator').default;

module.exports = function({template}) {
  return {
    visitor: {
      CallExpression(path, state) {
        if(path.node.callee.type == 'Import' && path.node.callee.loc) {
          let importNode = generator(path.node).code;
          let newImport = `Promise.resolve(${importNode}).catch((err) => {${state.opts.errorHandler}; throw err;})`;
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