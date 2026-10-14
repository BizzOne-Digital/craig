/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#070707',
        carbon: '#121212',
        signal: '#E10600',
        'deep-red': '#8F0000',
        bone: '#F3EEE6',
        steel: '#A8A8A8',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(225, 6, 0, 0.25)',
        'glow-lg': '0 0 80px rgba(225, 6, 0, 0.35)',
        card: '0 24px 60px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        'hero-mesh':
          'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(225,6,0,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(143,0,0,0.12), transparent 50%), linear-gradient(180deg, #070707 0%, #121212 100%)',
        'red-leak':
          'radial-gradient(circle at 85% 15%, rgba(225,6,0,0.22) 0%, transparent 45%)',
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        float: 'float 8s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
};
