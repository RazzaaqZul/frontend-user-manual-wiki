import axios from '../axios/axios'

export const indexUserManual = async () => {
  try {
    let config = {
      headers: {
        Accept: 'application/json'
      }
    }
    const response = await axios.get('/api/user-manuals', config)
    console.log(response.data.data)
    return response.data.data
  } catch (err) {
    console.log(err)
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
    return response.data.data
  } catch (err) {
    console.log(err.response.data)
  }
}

export const storeUserManual = async (request) => {
  try {
    // Filter out properties with empty values from the request data
    // const filteredData = Object.fromEntries(
    //   Object.entries(request).filter(([key, value]) => value !== '')
    // );
    const data = request
    const tokenData = localStorage.getItem('token')
    const tokenObject = JSON.parse(tokenData)
    const token = tokenObject.token
    console.warn(data)
    let config = {
      headers: {
        Accept: 'application/json',
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
    // Filter out properties with empty values from the request data
    // const filteredData = Object.fromEntries(
    //   Object.entries(request).filter(([key, value]) => value !== '')
    // );

    const tokenData = localStorage.getItem('token')
    const tokenObject = JSON.parse(tokenData)
    const token = tokenObject.token

    let config = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    const response = await axios.put(`/api/user-manuals/${id}`, request, config)
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
