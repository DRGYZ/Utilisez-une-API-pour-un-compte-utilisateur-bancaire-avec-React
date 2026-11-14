import api from './axios'

export async function loginUser(email, password) {
  const response = await api.post('/user/login', { email, password })
  return response.data
}

export async function fetchUserProfile(token, signal) {
  const response = await api.post(
    '/user/profile',
    {},
    {
      signal,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export async function updateUserProfile(token, firstName, lastName, signal) {
  const response = await api.put(
    '/user/profile',
    { firstName, lastName },
    {
      signal,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}
