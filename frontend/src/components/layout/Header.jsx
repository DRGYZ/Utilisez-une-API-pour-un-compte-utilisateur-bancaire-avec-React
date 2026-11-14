import { Link, NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../assets/img/argentBankLogo.png'
import {
  logout,
  selectIsAuthenticated
} from '../../features/auth/authSlice'
import { selectUserFirstName } from '../../features/user/userSlice'

export default function Header() {
  const dispatch = useDispatch()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const firstName = useSelector(selectUserFirstName)
  const showUserNav =
    isAuthenticated && !['/login', '/sign-in'].includes(location.pathname)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="ab-header">
      <nav className="ab-header-inner main-nav" aria-label="Primary navigation">
        <Link className="ab-brand main-nav-logo" to="/" aria-label="Argent Bank Home">
          <span className="ab-logo-box">
            <img className="ab-logo-img main-nav-logo-image" src={logo} alt="Argent Bank Logo" />
          </span>
          <h1 className="sr-only">Argent Bank</h1>
        </Link>

        <div className="ab-nav">
          {showUserNav ? (
            <>
              <NavLink
                className={({ isActive }) =>
                  `ab-nav-btn main-nav-item${isActive ? ' is-current' : ''}`
                }
                to="/profile"
              >
                <svg
                  className="ab-nav-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
                </svg>
                <span className="nav-first-name">{firstName || 'Profile'}</span>
              </NavLink>
              <Link
                className="ab-nav-btn is-signout main-nav-item"
                to="/"
                onClick={handleLogout}
              >
                <svg
                  className="ab-nav-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sign Out</span>
              </Link>
            </>
          ) : (
            <NavLink
              className={({ isActive }) =>
                `ab-nav-btn main-nav-item${isActive ? ' is-current' : ''}`
              }
              to="/login"
            >
              <svg
                className="ab-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
              </svg>
              <span>Sign In</span>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}
