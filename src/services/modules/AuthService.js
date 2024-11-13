import axios from '../axios/axios'

export const userLogin = async (request) => {
  try {
    const data = {
      email: request.email,
      password: request.password
    }
    const response = await axios.post(`/api/login`, data, {
      headers: {
        Accept: 'application/json'
      }
    })
    const getResponse = response.data.data
    // Store token and user data in localStorage
    localStorage.setItem('user', JSON.stringify(getResponse.data))
    localStorage.setItem('token', JSON.stringify(getResponse.token))

    return response
  } catch (err) {
    return err.response
  }
}

export const userRegister = async (request) => {
  try {
    // Ensure request is an object and spread it properly to add 'role'
    const data = {
      ...request,
      role: 'technical_writer'
    }

    const config = {
      headers: {
        Accept: 'application/json'
      }
    }

    // Send the modified 'data' instead of 'request'
    const response = await axios.post('/api/register', data, config)

    return response.data.data
  } catch (err) {
    // Handle the error and return the error response properly
    return err.response
  }
}

export const userLogout = async () => {
  try {
    const tokenData = localStorage.getItem('token')
    const tokenObject = JSON.parse(tokenData)
    const token = tokenObject?.token

    const config = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}` // Menyertakan token dalam header Authorization
      }
    }

    const response = await axios.delete('/api/logout', config)

    // Menghapus data dari localStorage setelah logout berhasil
    localStorage.removeItem('token')
    localStorage.removeItem('user') // Jika ada data user lain yang ingin dihapus

    return response
  } catch (err) {
    console.error('Error during logout:', err)
    return err
  }
}
