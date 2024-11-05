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

export const validateToken = async (token) => {
  try {
    const response = await axios.get('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data // Token is valid
  } catch (error) {
    return false // Token is invalid
  }
}

// Create a reusable auth guard function
export const authGuard = async (to, from, next) => {
  const getToken = localStorage.getItem('token')
  const token = getToken ? JSON.parse(getToken).token : null

  if (!token) {
    next({ path: '/' }) // Redirect to landing page if no token
  } else {
    const userData = await validateToken(token)
    if (userData) {
      next() // Proceed to the route
    } else {
      next({ path: '/' }) // Redirect to landing page if token is invalid
    }
  }
}

// Create an admin auth guard function
export const authGuardAdmin = async (to, from, next) => {
  const getToken = localStorage.getItem('token')
  const token = getToken ? JSON.parse(getToken).token : null

  if (!token) {
    next({ path: '/' }) // Redirect to landing page if no token
  } else {
    const userData = await validateToken(token)
    if (userData && userData.role === 'admin') {
      next() // Proceed to the route if user is admin
    } else {
      next({ path: '/' }) // Redirect to landing page if not admin
    }
  }
}

// Fetch user role on created
export const fetchUserRole = async () => {
  const getToken = localStorage.getItem('token')
  const token = getToken ? JSON.parse(getToken).token : null

  if (token) {
    const userData = await validateToken(token)
    if (userData) {
      return userData.role // Store the user's role
    }
  }
}
