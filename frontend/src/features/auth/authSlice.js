import { createAsyncThunk, createListenerMiddleware, createSlice } from '@reduxjs/toolkit'
import { loginUser } from '../../api/userApi'

export const TOKEN_STORAGE_KEY = 'argentBankToken'

function getStoredToken() {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

function saveToken(token, rememberMe) {
  removeToken()
  try {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(TOKEN_STORAGE_KEY, token)
  } catch {
    // The current tab can still use the in-memory session.
  }
}

function removeToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // Storage is unavailable.
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

      return token
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to sign in.'))
    }
  }
)

const storedToken = getStoredToken()
const initialState = {
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  status: 'idle',
  error: null,
  requestId: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.isAuthenticated = false
      state.status = 'idle'
      state.error = null
      state.requestId = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.token = action.payload
        state.isAuthenticated = true
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.token = null
        state.isAuthenticated = false
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { logout } = authSlice.actions

export const authStorage = createListenerMiddleware()
authStorage.startListening({
  actionCreator: login.fulfilled,
  effect: (action, { getState }) => {
    if (getState().auth.requestId === action.meta.requestId) {
      saveToken(action.payload, action.meta.arg.rememberMe)
    }
  }
})
authStorage.startListening({
  actionCreator: login.rejected,
  effect: (action, { getState }) => {
    if (getState().auth.requestId === action.meta.requestId) removeToken()
  }
})
authStorage.startListening({ actionCreator: logout, effect: removeToken })

export const selectToken = state => state.auth.token
export const selectIsAuthenticated = state => state.auth.isAuthenticated
export const selectAuthStatus = state => state.auth.status
export const selectAuthError = state => state.auth.error

export default authSlice.reducer
