/** @type {import('tailwindcss').Config} */
export default {
  content: [ 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colorTotal: "#004280",
        color: "#333",
        border: "#4e4e4e",
        dark: "#212429",
        footer: "#0F2145",
        header: "#333",
        price: "#28C76F",
        verdeLima: "#90ff00",
        backgroundButton: "#f2f2f2",
        azul: "#3259eb",
        text: "#353531",
        red: "#DA291C",
        orange: "#FA8900",
        yellow: "#fff200",
        purple: "#3E31FA",
        cleanPurple: "#8760f6",
        background: "#f4f3f8",
        bgDark: "#2d3137",
        grayText: "#e2e2e2",
        bgInput: "#EDEFF2",
        iconColor: "#607D8B"
      },
      fontFamily: {
        Roboto: "Roboto",
        Gow: "gow"              
       },
       keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-in-out',
        fadeInUp: 'fadeInUp 0.6s ease-out',
        slideDown: 'slideDown 0.5s ease-out',
        scaleIn: 'scaleIn 0.5s ease-out',
      }, 
    },
  },
  plugins: [],
}


