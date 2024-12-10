/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.html",
    "./src/**/*.css",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(8px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards'
      }
    }
  },
  plugins: [
    require("daisyui")
  ],
  mode: 'jit',
  safelist: [
    'space-y-1',
    'space-y-2',
    'space-y-3',
    'space-y-4',
    'space-y-6',
    'space-y-8',
  ]
}
