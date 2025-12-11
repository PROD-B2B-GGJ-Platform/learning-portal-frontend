/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Match main platform colors
        'primary-blue': '#2E5C8A',
        'success-green': '#27AE60',
        'text-dark': '#2C3E50',
        'text-medium': '#5A6C7D',
        'text-light': '#95A5A6',
        'border-light': '#CCCCCC',
        'bg-page': '#F5F5F5',
        'topbar-start': '#1e3a8a',
        'topbar-middle': '#3b5998',
        'topbar-end': '#7c8db5',
      },
    },
  },
  plugins: [],
}
