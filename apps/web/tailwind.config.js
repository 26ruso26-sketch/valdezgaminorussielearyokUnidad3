/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prisma: {
          navy: '#0F172A',
          blue: '#1E3A8A',
          teal: '#0D9488',
          amber: '#D97706',
          slate: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
};

