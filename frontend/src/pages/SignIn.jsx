import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  login,
  selectAuthError,
  selectAuthStatus
} from '../features/auth/authSlice'

const DEMO_ACCOUNTS = [
  {
    id: 'tony',
    name: 'Tony Stark',
    email: 'tony@stark.com',
    password: 'password123'
  },
  {
    id: 'steve',
    name: 'Steve Rogers',
    email: 'steve@rogers.com',
    password: 'password456'
  }
]

export default function SignIn() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const authStatus = useSelector(selectAuthStatus)
  const authError = useSelector(selectAuthError)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [dismissedRedirect, setDismissedRedirect] = useState(false)
  const isLoading = authStatus === 'loading'
  const protectedFromPath = location.state?.from?.pathname
  const redirectPath = protectedFromPath || '/profile'

  const submitCredentials = async (targetEmail, targetPassword) => {
    try {
      await dispatch(
        login({ email: targetEmail, password: targetPassword, rememberMe })
      ).unwrap()
      navigate(redirectPath, { replace: true })
    } catch {
      // Error messages are stored in Redux and rendered below.
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()
    await submitCredentials(email, password)
  }

  const handleQuickLogin = async (account, autoSubmit) => {
    setEmail(account.email)
    setPassword(account.password)
    if (autoSubmit) {
      await submitCredentials(account.email, account.password)
    }
  }

  return (
    <main className="ab-main">
      <div className="ab-container">
        <div className="signin-layout">
          <section className="signin-card sign-in-content" aria-labelledby="signinHeading">
            <div className="signin-header">
              <p className="eyebrow">Protected Session</p>
              <h1 className="signin-title" id="signinHeading">
                Sign In
              </h1>
              <p className="signin-subtitle">
                Sign in to reach your protected account overview and profile settings.
              </p>
            </div>

            {protectedFromPath && !dismissedRedirect ? (
              <div className="banner-alert is-warn" role="status">
                <span>
                  Protected route: Please sign in to access{' '}
                  <strong className="mono">{protectedFromPath}</strong>.
                </span>
                <button
                  className="btn-ghost"
                  type="button"
                  onClick={() => setDismissedRedirect(true)}
                >
                  Dismiss
                </button>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-field input-wrapper">
                <label className="form-label" htmlFor="username">
                  <span>Username (Email)</span>
                  <span className="form-hint">Required</span>
                </label>
                <input
                  className="form-input"
                  type="email"
                  id="username"
                  autoComplete="username"
                  placeholder="tony@stark.com"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-field input-wrapper">
                <label className="form-label" htmlFor="password">
                  <span>Password</span>
                  <span className="form-hint">Required</span>
                </label>
                <input
                  className="form-input"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="remember-box">
                <label className="remember-row input-remember" htmlFor="remember-me">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={event => setRememberMe(event.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Remember me</span>
                </label>
                <p className="remember-note">
                  {rememberMe
                    ? 'Checked: token persists in localStorage across browser restarts'
                    : 'Unchecked: token stays in sessionStorage (this tab only)'}
                </p>
              </div>

              {authError ? (
                <p className="form-error" role="alert">
                  {authError}
                </p>
              ) : null}

              <div className="signin-actions">
                <button
                  className="btn-primary sign-in-button"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
          </section>

          <aside className="demo-panel" aria-label="Seeded demo accounts">
            <h2 className="demo-panel-title">Seeded Demo Accounts</h2>
            <p className="demo-panel-sub">
              Both accounts are seeded via <span className="mono">npm run populate-db</span> and
              authenticate against Express &amp; MongoDB.
            </p>

            <div className="demo-account-list">
              {DEMO_ACCOUNTS.map((account, index) => (
                <div className="demo-account-row" key={account.id}>
                  <div className="demo-account-meta">
                    <p className="demo-account-name">{account.name}</p>
                    <p className="demo-account-creds">
                      {account.email} · {account.password}
                    </p>
                  </div>
                  <div className="demo-account-actions">
                    <button
                      className="btn-ghost"
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleQuickLogin(account, false)}
                    >
                      Fill only
                    </button>
                    <button
                      className={index === 0 ? 'btn-primary' : 'btn-secondary'}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleQuickLogin(account, true)}
                    >
                      Fill &amp; Sign In
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="route-notes">
              <strong>Session &amp; Route Behavior Preserved:</strong>
              <br />
              • Route aliases: <span className="mono">/login</span> &amp;{' '}
              <span className="mono">/sign-in</span>, protected{' '}
              <span className="mono">/profile</span> &amp; <span className="mono">/user</span>.
              <br />
              • Token key: <span className="mono">argentBankToken</span> stored in{' '}
              <span className="mono">localStorage</span> when Remember me is checked, or{' '}
              <span className="mono">sessionStorage</span> otherwise.
              <br />• Invalid or expired sessions clear automatically on 401 and return here.
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
