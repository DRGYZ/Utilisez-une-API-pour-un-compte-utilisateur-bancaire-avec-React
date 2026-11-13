import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  login,
  selectAuthError,
  selectAuthStatus
} from '../features/auth/authSlice'

export default function SignIn() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const authStatus = useSelector(selectAuthStatus)
  const authError = useSelector(selectAuthError)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const isLoading = authStatus === 'loading'
  const redirectPath = location.state?.from?.pathname || '/profile'

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      await dispatch(login({ email, password, rememberMe })).unwrap()
      navigate(redirectPath, { replace: true })
    } catch {
      // Error messages are stored in Redux and rendered below.
    }
  }

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input
              type="email"
              id="username"
              autoComplete="username"
              value={email}
              onChange={event => setEmail(event.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="input-remember">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={event => setRememberMe(event.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          {authError ? (
            <p className="form-error" role="alert">
              {authError}
            </p>
          ) : null}
          <button className="sign-in-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  )
}
