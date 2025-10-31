// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust paths as per your project
  ],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1200px",
    },
    extend: {
      fontFamily: {
         sans: ['"DM Sans"', '"Bricolage Grotesque"', 'sans-serif'],

       // Headings – Instrument Serif 600
       display: [ '"Bricolage Grotesque "', 'serif'],
       
         segoe: ['Instrument Serif', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
