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
        ink: {
          950: '#141414',
          900: '#1C1C1C',
          850: '#232323',
          800: '#2B2B2B', // Charcoal Noir
          750: '#3D3D3D',
          700: '#565656', // Ironclad Grey
          600: '#6E6E6E',
          500: '#848484', // Urban Fog
          400: '#9E9E9E',
          300: '#B3B3B3', // Moonlit Silver
          200: '#CCCCCC',
          100: '#E0E0E0', // Cloud Veil
          50: '#F5F5F5',
        },
        brand: {
          50: '#F8F8F8',
          100: '#F0F0F0',
          200: '#E0E0E0', // Cloud Veil
          300: '#C8C8C8',
          400: '#B3B3B3', // Moonlit Silver
          500: '#848484', // Urban Fog
          600: '#565656', // Ironclad Grey
          700: '#3D3D3D',
          800: '#2B2B2B', // Charcoal Noir
          900: '#1C1C1C',
          950: '#121212',
        },
        teal: {
          50: '#F5F5F5',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3', // Moonlit Silver
          400: '#999999',
          500: '#848484', // Urban Fog
          600: '#666666',
          700: '#565656', // Ironclad Grey
          800: '#3B3B3B',
          900: '#2B2B2B', // Charcoal Noir
          950: '#1A1A1A',
        },
        ocean: {
          50: '#FAFAFA',
          100: '#EDEDED',
          200: '#D6D6D6',
          300: '#BDBDBD',
          400: '#A3A3A3',
          500: '#848484',
          600: '#696969',
          700: '#565656',
          800: '#404040',
          900: '#2B2B2B',
          950: '#181818',
        },
        iris: {
          50: '#F7F7F7',
          100: '#EDEDED',
          200: '#D9D9D9',
          300: '#C4C4C4',
          400: '#ABABAB',
          500: '#8E8E8E',
          600: '#737373',
          700: '#565656',
          800: '#3E3E3E',
          900: '#2B2B2B',
          950: '#171717',
        },
        accent: {
          50: '#FAFAFA',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#B3B3B3',
          400: '#848484',
          500: '#565656',
          600: '#3D3D3D',
          700: '#2B2B2B',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
        '4xl': '1.75rem',
        '5xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(224,224,224,0.22), 0 0 48px -8px rgba(179,179,179,0.15)',
        'glow-teal': '0 0 24px -4px rgba(179,179,179,0.25), 0 0 48px -8px rgba(132,132,132,0.18)',
        'glow-blue': '0 0 24px -4px rgba(224,224,224,0.25), 0 0 48px -8px rgba(179,179,179,0.15)',
        'glow-iris': '0 0 24px -4px rgba(200,200,200,0.22), 0 0 48px -8px rgba(132,132,132,0.15)',
        'glow-accent': '0 0 24px -4px rgba(224,224,224,0.25), 0 0 48px -8px rgba(179,179,179,0.15)',
        soft: '0 2px 24px -4px rgba(0,0,0,0.45), 0 1px 0 0 rgba(255,255,255,0.06) inset',
        card: '0 4px 24px -8px rgba(0,0,0,0.6), 0 1px 0 0 rgba(255,255,255,0.06) inset',
        'card-hover': '0 8px 40px -8px rgba(179,179,179,0.12), 0 1px 0 0 rgba(255,255,255,0.1) inset',
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
