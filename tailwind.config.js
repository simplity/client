/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './node_modules/flowbite-datepicker/js/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
