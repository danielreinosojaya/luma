import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"],
      },
      colors: {
        "salon-dark": "#1e1919",
        "salon-cream": "#f7f5f2",
        "salon-accent": "#61525a",
        "salon-subtle": "#736c64",
        "salon-subtle-dark": "#bbb5ae",
        "luma-gold": "#fad24b",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      letterSpacing: {
        wider: "0.05em",
        widest: "0.1em",
        "extra-wide": "0.15em",
        "super-wide": "0.3em",
      },
    },
  },
  plugins: [],
};

export default config;
