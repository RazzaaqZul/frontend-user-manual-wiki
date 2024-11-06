import axios from '../axios/axios'

export const indexUserManual = async () => {
  try {
    let config = {
      headers: {
        Accept: 'application/json'
      }
    }
    const response = await axios.get('/api/user-manuals', config)
    return response.data.data
  } catch (err) {
    return err.response
  }
}

export const showUserManual = async (id) => {
  try {
    let config = {
      headers: {
        Accept: 'application/json'
      }
    }

    const response = await axios.get(`/api/user-manuals/${id}`, config)
    // console.log(response)
    return response.data.data
  } catch (err) {
    console.log(err.response.data)
  }
}

export const storeUserManual = async (request) => {
  try {
    const data = request
    const tokenData = localStorage.getItem('token')
    const tokenObject = JSON.parse(tokenData)
    const token = tokenObject.token

    // console.warn(data)
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    }

    const response = await axios.post(`/api/user-manuals`, data, config)
    return response
  } catch (err) {
    return err.response
  }
}

export const updateUserManual = async (request, id) => {
  try {
    const tokenData = localStorage.getItem('token')
    const tokenObject = JSON.parse(tokenData)
    const token = tokenObject.token

    let config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    }

    console.log('Data request')
    console.log(request)

    /**
     * Laravel REST API PATCH and PUT method does not work with form-data,
     * it's known issue of Symfony and even PHP
     */
    const response = await axios.post(`/api/user-manuals/${id}?_method=PUT`, request, config)
    console.log(response)
    return response // Return the response on success
  } catch (err) {
    console.error(err)
    return err.response // Return the error response for handling in the component
  }
}

export const destroyUserManual = async (id) => {
  try {
    const tokenData = localStorage.getItem('token')
    const tokenObject = JSON.parse(tokenData)
    const token = tokenObject.token
    let config = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.delete(`/api/user-manuals/${id}`, config)
    return response.data.data
  } catch (err) {
    console.log(err.response.data)
  }
}

export const userManualSeacrh = async (newQuery) => {
  try {
    const response = await axios.get(`/api/user-manuals/search?q=${newQuery}`)
    console.log(response)
    return response.data.data
  } catch (err) {
    console.log(err)
  }
}
