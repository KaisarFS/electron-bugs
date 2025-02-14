/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #5fb756 0%, #55acb3 100%)'
      },
      colors: {
        primary: '#5fb756'
      }
    }
  },
  plugins: []
}
