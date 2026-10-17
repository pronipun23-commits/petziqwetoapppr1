/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Charcoal Noir monochromatic palette:
        // Charcoal Noir: #2B2B2B
        // Ironclad Grey: #565656
        // Urban Fog: #848484
        // Moonlit Silver: #B3B3B3
        // Cloud Veil: #E0E0E0
        // Biophilic Monochromatic Obsidian & Emerald Palette:
        ink: {
          950: '#06080A', // Matte Obsidian Canvas
          900: '#0C1014',
          850: '#11171C',
          800: '#182026',
          750: '#232C33',
          700: '#34404A',
          600: '#4D5D6B',
          500: '#6E8294',
          400: '#94A6B8',
          300: '#B8C7D6',
          200: '#D5DFEA',
          100: '#EAF0F6',
          50: '#F5F8FA',
        },
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Core Biophilic Emerald
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF', // Botanical Sage
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        ocean: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        iris: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Isolated Functional Warning Amber
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
        '4xl': '1.75rem',
        '5xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(16,185,129,0.25), 0 0 48px -8px rgba(16,185,129,0.15)',
        'glow-teal': '0 0 24px -4px rgba(45,212,191,0.25), 0 0 48px -8px rgba(45,212,191,0.15)',
        'glow-blue': '0 0 24px -4px rgba(16,185,129,0.25), 0 0 48px -8px rgba(45,212,191,0.15)',
        'glow-iris': '0 0 24px -4px rgba(16,185,129,0.22), 0 0 48px -8px rgba(16,185,129,0.15)',
        'glow-accent': '0 0 24px -4px rgba(245,158,11,0.25), 0 0 48px -8px rgba(245,158,11,0.15)',
        soft: '0 2px 24px -4px rgba(0,0,0,0.7), 0 1px 0 0 rgba(255,255,255,0.06) inset',
        card: '0 4px 24px -8px rgba(0,0,0,0.8), 0 1px 0 0 rgba(255,255,255,0.06) inset',
        'card-hover': '0 8px 40px -8px rgba(16,185,129,0.15), 0 1px 0 0 rgba(16,185,129,0.2) inset',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(6deg)' },
        },
        'float-medium': {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(-4deg)' },
        },
        'float-fast': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'gradient-pan': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.6s ease both',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-medium': 'float-medium 6s ease-in-out infinite',
        'float-fast': 'float-fast 4s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
};
