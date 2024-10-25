import axios from '../axios/axios'

export const userLogin = async (request) => {
  try {
    const data = {
      username: request.username,
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

    return response.data.data
  } catch (err) {
    return err.response?.data
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
