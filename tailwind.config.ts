import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: { 
          50:'#EFF6F0', 
          300:'#B8D4BC', 
          500:'#6DAF7D', 
          700:'#4A7C59', 
          900:'#2D4A3E', 
          950:'#1A2420' 
        },
        earth:  { 
          300:'#F2C87E', 
          600:'#C47B3A' 
        },
        linen:  { 
          50:'#F9F5EE', 
          100:'#E8E0CC' 
        },
        stone:  { 
          500:'#8C8C7A' 
        },
      },
      fontFamily: { 
        serif: ['Lora', 'serif'], 
        sans: ['DM Sans', 'sans-serif'] 
      },
    },
  },
  plugins: [],
} satisfies Config
