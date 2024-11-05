import axios from 'axios'

export default axios.create({
  baseURL: 'http://127.0.0.1:8000',
  // baseURL: 'https://5d51-182-0-100-169.ngrok-free.app',
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
})
