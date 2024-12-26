/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  prefix: "apexx-",
  theme: {
    extend: {
      // Add any custom theme extensions here
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
