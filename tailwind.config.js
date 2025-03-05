/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {
      backgroundImage: {
        loginbg: "url('../assets')", // Replace with the actual path
      },
    },
  },
 
  plugins: [
    require('tailwind-clip-path'),
    require('tailwind-scrollbar-hide'),

    // require('tailwind-scrollbar-hide'),

    plugin(function ({ addUtilities }) {
      addUtilities({
        '.transition-clip-path': {
          transition: 'clip-path 0.3s ease-in-out',
        },
      });
    }),
  ]
}

// module.exports = {
//   plugins: [
//     require('tailwind-scrollbar-hide'),
//   ],
// };
