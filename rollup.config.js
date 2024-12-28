import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";

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
    css({
      output: function (styles) {
        require("fs").writeFileSync("dist/styles.css", styles);
      },
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      include: ["src/**/*.{ts,tsx}"],
    }),
    resolve({
      extensions: [".ts", ".tsx", ".css"],
    }),
    commonjs(),
  ],
};
