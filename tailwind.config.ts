import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FFF8DE',
          secondary: '#FFFFFF',
          neutral: '#F6F7FB',
        },
        text: {
          primary: '#111827',
          muted: '#6B7280',
        },
        accent: '#3b82f6',
        success: '#22c55e',
        warning: '#F59E0B',
        danger: '#ef4444',
        pastel: {
          mint: '#ECFDF3',
          amber: '#FFF4E5',
          rose: '#F9DFDF',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
