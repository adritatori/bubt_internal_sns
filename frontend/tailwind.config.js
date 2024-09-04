module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neu-light': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
        'neu-dark': '5px 5px 10px #bec8d6, -5px -5px 10px #ffffff',
      },
      backgroundColor: {
        'neu-base': '#e0e5ec',
      },
    },
  },
  plugins: [],
}