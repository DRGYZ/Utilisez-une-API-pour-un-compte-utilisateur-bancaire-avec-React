import { configureStore } from '@reduxjs/toolkit'
import authReducer, { authStorage } from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(authStorage.middleware),
  reducer: {
    auth: authReducer,
    user: userReducer
  }
})
