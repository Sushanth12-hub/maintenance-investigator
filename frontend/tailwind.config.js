/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        refinery: {
          900: "#0B192C",
          800: "#1E2A38",
        },
        industrial: {
          bg: "#F4F5F7",
          border: "#E2E8F0",
        }
      }
    },
  },
  plugins: [],
}
