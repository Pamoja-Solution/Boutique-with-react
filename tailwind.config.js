import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
          
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['Georgia', 'serif'],
                mono: ['Menlo', 'monospace'],
                rounded: ['"M PLUS Rounded 1c"', 'sans-serif'],
                dancing: ['"Dancing Script"', 'cursive'],
                comfortaa: ['Comfortaa', 'sans-serif'],
                ubuntu: ['Ubuntu', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
                montserrat: ['Montserrat', 'sans-serif'],
                playfair: ['Playfair Display', 'serif'],
                lato: ['Lato', 'sans-serif'],
                raleway: ['Raleway', 'sans-serif'],
                nunito: ['Nunito', 'sans-serif'],
                pacifico: ['Pacifico', 'cursive'],
                oswald: ['Oswald', 'sans-serif'],
                quicksand: ['Quicksand', 'sans-serif']
              }
        },
    },

    plugins: [require('daisyui'),forms],
};
