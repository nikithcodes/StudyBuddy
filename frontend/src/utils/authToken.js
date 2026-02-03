const AUTH_TOKEN_KEY = 'studybuddy_auth_token'

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const isTokenValid = () => {
  const token = getAuthToken()
  return !!token
}
