/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./public/**/*.{html,js}"
    ],
    theme: {
        extend: {
            colors: {
                'text-color-main':"white",
                'text-color-accent':"#595959",
            },
            screens: {
                'xs': '480px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
                'custom': '1440px',
                'huge': '1920px'
            }
        },
    },
    plugins: [],
}