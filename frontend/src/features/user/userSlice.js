import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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

export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetchUserProfile(requireToken(getState))
      return response.body
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to load profile.'))
    }
  }
)

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ firstName, lastName }, { getState, rejectWithValue }) => {
    try {
      const response = await updateUserProfile(
        requireToken(getState),
        firstName,
        lastName
      )
      return response.body
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to update profile.'))
    }
  }
)

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  id: '',
  status: 'idle',
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.firstName = ''
      state.lastName = ''
      state.email = ''
      state.id = ''
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getProfile.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName
        state.lastName = action.payload.lastName
        state.email = action.payload.email
        state.id = action.payload.id
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(updateProfile.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName
        state.lastName = action.payload.lastName
        state.email = action.payload.email
        state.id = action.payload.id
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { clearUser } = userSlice.actions

export const selectUser = state => state.user
export const selectUserFirstName = state => state.user.firstName
export const selectUserFullName = state =>
  `${state.user.firstName} ${state.user.lastName}`.trim()
export const selectUserStatus = state => state.user.status
export const selectUserError = state => state.user.error

export default userSlice.reducer
