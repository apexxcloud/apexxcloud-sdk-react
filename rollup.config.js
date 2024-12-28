import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

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
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      config: {
        path: "./postcss.config.js",
      },
      plugins: [tailwindcss("./tailwind.config.js"), autoprefixer()],
      modules: true,
      extensions: [".css"],
      minimize: true,
      extract: "styles.css",
      autoModules: true,
      inject: true,
      use: ["sass"],
      writeDefinitions: true,
    }),
  ],
};
