import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from '../auth/authSlice'
import {
  fetchUserProfile,
  updateUserProfile
} from '../../api/userApi'

function getErrorMessage(error, fallbackMessage) {
  return error.response?.data?.message || error.message || fallbackMessage
}

function requireToken(getState) {
  const token = getState().auth.token

  if (!token) {
    throw new Error('Authentication is required.')
  }

  return token
}

function profileError(error, fallback, token, { dispatch, getState, rejectWithValue }) {
  if (error.response?.status === 401 && getState().auth.token === token) {
    dispatch(logout())
  }
  return rejectWithValue(getErrorMessage(error, fallback))
}

export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, api) => {
    const token = requireToken(api.getState)
    try {
      const response = await fetchUserProfile(token, api.signal)
      return response.body
    } catch (error) {
      return profileError(error, 'Unable to load profile.', token, api)
    }
  },
  {
    condition: (_, { getState }) => getState().user.status !== 'loading'
  }
)

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ firstName, lastName }, api) => {
    const token = requireToken(api.getState)
    try {
      const response = await updateUserProfile(
        token,
        firstName,
        lastName,
        api.signal
      )
      return response.body
    } catch (error) {
      return profileError(error, 'Unable to update profile.', token, api)
    }
  }
)

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  id: '',
  status: 'idle',
  error: null,
  requestId: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(logout, () => initialState)
      .addCase(getProfile.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.status = 'loading'
        state.error = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.firstName = action.payload.firstName
        state.lastName = action.payload.lastName
        state.email = action.payload.email
        state.id = action.payload.id
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(getProfile.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(updateProfile.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.firstName = action.payload.firstName
        state.lastName = action.payload.lastName
        state.email = action.payload.email
        state.id = action.payload.id
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const selectUser = state => state.user
export const selectUserFirstName = state => state.user.firstName
export const selectUserFullName = state =>
  `${state.user.firstName} ${state.user.lastName}`.trim()
export const selectUserStatus = state => state.user.status
export const selectUserError = state => state.user.error

export default userSlice.reducer
