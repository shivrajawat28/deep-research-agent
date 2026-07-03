/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        card: '#1E293B',
        primary: '#2563EB',
        success: '#22C55E',
        text: '#F8FAFC',
        muted: '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        button: '0 14px 30px rgba(37, 99, 235, 0.26)',
        soft: '0 24px 70px rgba(2, 6, 23, 0.28)',
        subtle: '0 14px 34px rgba(2, 6, 23, 0.18)',
      },
      opacity: {
        6: '0.06',
        8: '0.08',
        12: '0.12',
        15: '0.15',
        45: '0.45',
        78: '0.78',
      },
    },
  },
  plugins: [],
};
