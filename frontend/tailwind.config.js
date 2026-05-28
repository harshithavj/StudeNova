/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nova: {
          coral: '#FF5F6D',
          peach: '#FFE5E8',
          pink: '#FFDEE9',
          lavender: '#E8DDFD',
          sky: '#F4F7FF',
          soft: '#F8FAFC',
          ink: '#1E293B',
          muted: '#64748B'
        }
      },
      boxShadow: {
        soft: '0 18px 60px rgba(30, 41, 59, 0.08)',
        coral: '0 18px 50px rgba(255, 95, 109, 0.18)'
      }
    }
  },
  plugins: []
};
