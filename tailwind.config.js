/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                serfor: {
                    light: '#4caf50',
                    DEFAULT: '#2e7d32',
                    dark: '#1b5e20',
                },
                minagri: {
                    blue: '#1e88e5',
                }
            }
        },
    },
    plugins: [],
}
