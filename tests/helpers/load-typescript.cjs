const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Run the real TypeScript code; callers can isolate browser-only imports.
function createLoader(mocks = {}, globals = {}) {
  const cache = new Map();
  function load(relative) {
    const filename = path.resolve(relative);
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    cache.set(filename, module.exports);
    const { outputText } = ts.transpileModule(
      fs.readFileSync(filename, "utf8"),
      {
        fileName: filename,
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2023,
          esModuleInterop: true,
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
    );
    vm.runInNewContext(
      outputText,
      {
        exports: module.exports,
        module,
        process,
        ...globals,
        require(id) {
          if (Object.hasOwn(mocks, id)) return mocks[id];
          if (id.endsWith("/table.utils"))
            return new Proxy({}, { get: () => () => () => null });
          if (!id.startsWith(".")) return require(id);
          const base = path.resolve(path.dirname(filename), id);
          return load(
            fs.existsSync(`${base}.ts`) ? `${base}.ts` : `${base}.tsx`,
          );
        },
      },
      { filename },
    );
    return module.exports;
  }
  return load;
}
module.exports = { createLoader, load: createLoader() };
