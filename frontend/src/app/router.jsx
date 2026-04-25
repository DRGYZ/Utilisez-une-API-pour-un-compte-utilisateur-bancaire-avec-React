import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import ProtectedRoute from '../components/ProtectedRoute'
import Home from '../pages/Home'
import SignIn from '../pages/SignIn'
import Profile from '../pages/Profile'
import NotFound from '../pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'sign-in',
        element: <SignIn />
      },
      {
        path: 'login',
        element: <Navigate to="/sign-in" replace />
      },
      {
        path: 'user',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Profile />
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])
