import resolve from "@rollup/plugin-node-resolve";

export default [
  // ESM 版本（给前端 import 用）
  {
    input: "index.js",
    output: {
      file: "dist/index.js",
      format: "esm",
    },
    plugins: [resolve()],
  },
  // CJS 版本（给 Node.js require 用）
  {
    input: "index.js",
    output: {
      file: "dist/index.cjs",
      format: "cjs",
    },
    plugins: [resolve()],
  },
];
