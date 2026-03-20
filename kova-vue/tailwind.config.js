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
        "outline": "#777575",
        "on-primary-fixed-variant": "#456900",
        "on-primary-fixed": "#304a00",
        "on-background": "#ffffff",
        "inverse-primary": "#456900",
        "secondary-fixed-dim": "#d1dd53",
        "background": "#0a0a0a",
        "surface": "#0a0a0a", // changed from 121212
        "surface-container-lowest": "#050505",
        "on-secondary-fixed": "#161b00",
        "on-surface-variant": "#c6c7c8",
        "primary-fixed": "#bdfcb3",
        "inverse-on-surface": "#202020",
        "on-error": "#690005",
        "outline-variant": "#444747",
        "secondary-fixed": "#eefaa8",
        "surface-container": "#141414", // changed from 1e1e1e
        "surface-container-high": "#181818", // changed from 282828
        "on-secondary-fixed-variant": "#404a00",
        "on-surface": "#ffffff",
        "primary": "#a0ec06", // using the pure lime 
        "on-primary": "#193700",
        "error-container": "#ffdad6",
        "on-error-container": "#410002",
        "secondary": "#dfec5f",
        "on-secondary": "#283400",
        "secondary-container": "#3e4d00",
        "on-secondary-container": "#f1ffaa",
        "surface-container-highest": "#1c1c1c", // changed from 333333
        "primary-container": "#245000",
        "on-primary-container": "#bdfcb3",
        "error": "#ffb4ab",
        "inverse-surface": "#e2e2e2",
        "surface-container-low": "#0f0f0f", // changed from 1a1a1a
      },
      fontFamily: {
        "headline": ["Bodoni Moda", "serif"],
        "body": ["DM Sans", "sans-serif"],
        "label": ["DM Sans", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px"},
    },
  },
  plugins: [
    forms,
    containerQueries,
  ],
}
