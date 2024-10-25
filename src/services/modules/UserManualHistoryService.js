import axios from '../axios/axios'

export const showUserManualHistory = async (id) => {
  try {
    let config = {
      headers: {
        Accept: 'application/json'
      }
    }
    const response = await axios.get(`/api/user-manuals/${id}/histories`, config)
    return response.data.data
  } catch (err) {
    console.log(err.response.data)
  }
}

export const destroyUserManualHistory = async (user_manual_id, history_id) => {
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
    const response = await axios.delete(
      `/api/user-manuals/${user_manual_id}/histories/${history_id}`,
      config
    )
    return response.data.data
  } catch (err) {
    console.log(err.response.data)
  }
}

export const indexUserManualHistory = async (id, historyId) => {
  try {
    const tokenData = localStorage.getItem('token')
    const tokenObject = JSON.parse(tokenData)
    const token = tokenObject.token
    console.log(token)
    let config = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.get(`/api/user-manuals/${id}/histories/${historyId}`, config)
    return response.data.data
  } catch (err) {
    return err
  }
}
