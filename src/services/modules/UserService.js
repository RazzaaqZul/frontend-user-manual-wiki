import axios from '../axios/axios'

export const showUsers = async () => {
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

    const response = await axios.get(`/api/admin/users`, config)
    return response.data.data
  } catch (err) {
    return err.response
  }
}

export const updateUserbyId = async (id, request) => {
  try {
    const tokenData = localStorage.getItem('token')
    const tokenObject = JSON.parse(tokenData)
    const token = tokenObject.token
    console.log(request)
    console.log(id)
    let config = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    const response = await axios.put(`/api/admin/users/${id}`, request, config)
    return response
  } catch (err) {
    return err
  }
}

export const deleteUserById = async (id) => {
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
    const response = await axios.delete(`/api/admin/users/${id}`, config)
    return response
  } catch (err) {
    return err
  }
}
