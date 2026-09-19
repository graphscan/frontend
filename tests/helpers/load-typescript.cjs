const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Run the real TypeScript code; callers can isolate browser-only imports.
function createLoader(mocks = {}) {
  const cache = new Map();
  function load(relative) {
    const filename = path.resolve(relative);
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    cache.set(filename, module.exports);
    const { outputText } = ts.transpileModule(
      fs.readFileSync(filename, "utf8"),
      {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2020,
          esModuleInterop: true,
        },
      },
    );
    vm.runInNewContext(
      outputText,
      {
        exports: module.exports,
        module,
        process,
        require(id) {
          if (Object.hasOwn(mocks, id)) return mocks[id];
          if (id.endsWith("/table.utils"))
            return new Proxy({}, { get: () => () => () => null });
          if (!id.startsWith(".")) return require(id);
          return load(path.resolve(path.dirname(filename), `${id}.ts`));
        },
      },
      { filename },
    );
    return module.exports;
  }
  return load;
}
module.exports = { createLoader, load: createLoader() };
