/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#020617',      // Slate 950
        'bg-card': '#0f172a',      // Slate 900
        'primary-green': '#10b981',// Emerald 500
        'glow-green': '#047857',   // Emerald 700
        'text-main': '#f8fafc',
        'text-muted': '#94a3b8',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}