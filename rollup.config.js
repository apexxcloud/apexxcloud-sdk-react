import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.mjs",
      format: "es",
      sourcemap: true,
    },
  ],
  external: [
    "react",
    "react-dom",
    "react-dropzone",
    "@apexxcloud/sdk-js",
    "clsx",
  ],
  plugins: [
    resolve({
      extensions: [".ts", ".tsx", ".css"],
    }),
    postcss({
      inject: true,
      modules: false,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      include: ["src/**/*.{ts,tsx}"],
    }),
    commonjs(),
  ],
};
