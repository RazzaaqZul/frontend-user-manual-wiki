/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar'
import tailwindPrimeUI from 'tailwindcss-primeui'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      boxShadow: {
        'inner-thick': 'inset 0 0px 8px 0px rgba(0, 0, 0, 0.2)'
      },
      backgroundImage: {
        'gradient-color':
          'linear-gradient(180deg, rgba(58,133,211,1) 0%, rgba(88,169,106,1) 72%, rgba(93,175,87,1) 100%)',
        'gradient-color-card': 'linear-gradient(135deg, #D3DB29 0%, #72BC63 50%, #208CCC 100%)',
        'successfull-gradient':
          'linear-gradient(90deg, rgba(58,133,211,1) 0%, rgba(88,169,106,1) 63%, rgba(93,175,87,1) 100%)'
      },
      keyframes: {
        shake: {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '25%': {
            transform: 'translateY(-5px)'
          },
          '50%': {
            transform: 'translateY(5px)'
          },
          '75%': {
            transform: 'translateY(-5px)'
          }
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-15%)'
          },
          '50%': {
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'bounce-infinite': 'bounce 7000ms infinite',
        'shake-infinite': 'shake 6000ms infinite'
      }
    },
    colors: {
      'dark-blue': '#265B94',
      'soft-blue': '#3A85D3',
      'blue-button': '#226DA8',
      'yellow-custom': '#FFF501',
      'dark-yellow': '#D3DB29',
      'soft-yellow-transparent': '#D3DB29',
      'green-custom': '#3BAB47',
      'red-custom': '#FF0000',
      'red-error': '#C60000',
      'dark-red': '#BE2727',
      'grey-background': '#D9D9D9',
      'grey-word': '#7A7A7A',
      'grey-input': '#F1F1F1',
      'grey-button': '#A3A3A3',
      'white-background': '#FFFFFF',
      'primary-black': '#000000'
    }
  },
  plugins: [tailwindScrollbar, tailwindPrimeUI]
}
