/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "sk-primary": "var(--sk-color-primary)",
        "sk-primary-strong": "var(--sk-color-primary-strong)",
        "sk-on-primary": "var(--sk-color-on-primary)",
        "sk-text": "var(--sk-color-text)",
        "sk-text-muted": "var(--sk-color-text-muted)",
        "sk-border": "var(--sk-color-border)",
        "sk-border-strong": "var(--sk-color-border-strong)",
        "sk-surface-muted": "var(--sk-color-surface-muted)",
        "sk-danger": "var(--sk-color-danger)",
      },
      fontSize: {
        "skapa-display": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "700" }],
        "skapa-h1": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "skapa-h2": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.005em", fontWeight: "700" }],
        "skapa-h3": ["1.25rem", { lineHeight: "1.35", fontWeight: "700" }],
        "skapa-h4": ["1.125rem", { lineHeight: "1.4", fontWeight: "700" }],
        "skapa-body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "skapa-body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "skapa-body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "skapa-caption": ["0.75rem", { lineHeight: "1.45", letterSpacing: "0.01em", fontWeight: "400" }],
        "skapa-overline": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.12em", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
}
