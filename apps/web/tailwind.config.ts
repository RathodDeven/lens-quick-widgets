import type { Config } from 'tailwindcss'

const config: Config = {
  corePlugins: {
    preflight: false
  },
  // important: '#__next',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'p-bg': 'var(--primary-background)',
        's-bg': 'var(--secondary-background)',
        's-text': 'var(--secondary-text)',
        'p-text': 'var(--primary-text)'
      }
    }
  },
  plugins: []
}
export default config
