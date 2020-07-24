// ErrorHandler with retry logic for webpack

module.exports = function () {
  return `
    console.log("File", %%importName%%, "failed to load");
    return Promise.resolve(%%importNode%%);
  `;
}
