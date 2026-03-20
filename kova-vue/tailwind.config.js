import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#b1ff29",
        "primary-container": "#9eea00",
        "primary-dim": "#a3f011",
        "secondary": "#dfec5f",
        "secondary-container": "#5c6300",
        "background": "#0a0a0a",
        "surface": "#0e0e0e",
        "surface-variant": "#262626",
        "surface-container-low": "#131313",
        "surface-container": "#1a1919",
        "surface-container-high": "#201f1f",
        "surface-container-highest": "#262626",
        "on-surface": "#ffffff",
        "on-surface-variant": "#adaaaa",
        "outline": "#777575",
        "outline-variant": "#494847",
        "error": "#ff7351",
      },
      fontFamily: {
        "headline": ["Newsreader", "serif"],
        "body": ["Plus Jakarta Sans", "sans-serif"],
        "label": ["Plus Jakarta Sans", "sans-serif"],
        "dmsans": ["DM Sans", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px"},
    },
  },
  plugins: [
    forms,
    containerQueries,
  ],
}
