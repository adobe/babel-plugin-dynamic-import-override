/*
© Copyright 2020 Adobe. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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
            if (skipOverride.split(':')[1].trim() === "true") {
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