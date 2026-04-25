import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginUser } from '../../api/userApi'

export const TOKEN_STORAGE_KEY = 'argentBankToken'

function getStoredToken() {
  if (typeof localStorage === 'undefined') {
    return null
  }

  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

function saveToken(token) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  }
}

function removeToken() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

function getErrorMessage(error, fallbackMessage) {
  return error.response?.data?.message || error.message || fallbackMessage
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUser(email, password)
      const token = response.body?.token

      if (!token) {
        throw new Error('Login response did not include a token.')
      }

      saveToken(token)
      return token
    } catch (error) {
      removeToken()
      return rejectWithValue(getErrorMessage(error, 'Unable to sign in.'))
    }
  }
)

const initialState = {
  token: getStoredToken(),
  isAuthenticated: Boolean(getStoredToken()),
  status: 'idle',
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      removeToken()
      state.token = null
      state.isAuthenticated = false
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload
        state.isAuthenticated = true
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.token = null
        state.isAuthenticated = false
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { logout } = authSlice.actions

export const selectToken = state => state.auth.token
export const selectIsAuthenticated = state => state.auth.isAuthenticated
export const selectAuthStatus = state => state.auth.status
export const selectAuthError = state => state.auth.error

export default authSlice.reducer
