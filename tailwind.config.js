/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Base: Dark Charcoal #1A1A1A
        primary: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#1A1A1A',
          600: '#171717',
          700: '#141414',
          800: '#111111',
          900: '#0e0e0e',
        },
        // Accent / Call-to-Action: Jordan Red #C8102E
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#C8102E',
          600: '#b30e29',
          700: '#9e0c24',
          800: '#890a1f',
          900: '#74081a',
        },
        // Success / Confirmation: Jordan Green #007A33
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#007A33',
          600: '#006e2e',
          700: '#006229',
          800: '#005624',
          900: '#004a1f',
        },
        // Background / Neutral: White #FFFFFF
        background: {
          50: '#ffffff',
          100: '#f9f9f9',
          200: '#f3f3f3',
          300: '#ededed',
          400: '#e7e7e7',
          500: '#ffffff',
          600: '#f2f2f2',
          700: '#e5e5e5',
          800: '#d9d9d9',
          900: '#cccccc',
        },
        // Secondary Accent: Soft Gray #E5E5E5
        secondary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#E5E5E5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Optional Highlight: Gold / Yellow #FFD700
        highlight: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFD700',
          600: '#e6c200',
          700: '#ccad00',
          800: '#b39900',
          900: '#998000',
        },
        // Legacy dark colors for compatibility
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#1A1A1A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-noto-arabic)', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
