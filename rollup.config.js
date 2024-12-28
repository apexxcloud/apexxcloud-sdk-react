import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import fs from "fs";
import path from "path";

// Ensure dist directory exists
const distDir = path.join(process.cwd(), "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

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
        fs.writeFileSync(path.join(distDir, "styles.css"), styles);
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
