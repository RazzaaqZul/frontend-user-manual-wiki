import axios from '../axios/axios'

export const trashUserManual = async () => {
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
    const response = await axios.get(`/api/admin/user-manual/trash`, config)
    console.log(response)
    return response.data.data
  } catch (err) {
    return err.response
  }
}

export const deletePermanent = async (id) => {
  console.log(id)
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
    const response = await axios.get(`/api/admin/user-manual/${id}/delete`, config)

    console.log(id)
    console.log(response)
    return response.data.data
  } catch (err) {
    console.log(err)
    return err.response
  }
}
export const restoreUserManual = async (id) => {
  console.log(id)
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
    const response = await axios.get(`/api/admin/user-manual/${id}/restore`, config)

    console.log(id)
    console.log(response)
    return response.data.data
  } catch (err) {
    console.log(err)
    return err.response
  }
}
