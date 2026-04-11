/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          primary: "#0a2540",
          secondary: "#0d6efd",
          accent: "#ffc107",
          background: "#f8f9fa",
          surface: "#ffffff",
        }
      }
    },
  },
  plugins: [],
}
