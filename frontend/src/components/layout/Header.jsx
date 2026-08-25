import { Link, NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../assets/img/argentBankLogo.png'
import {
  logout,
  selectIsAuthenticated
} from '../../features/auth/authSlice'
import {
  clearUser,
  selectUserFirstName
} from '../../features/user/userSlice'

export default function Header() {
  const dispatch = useDispatch()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const firstName = useSelector(selectUserFirstName)
  const showUserNav =
    isAuthenticated && !['/login', '/sign-in'].includes(location.pathname)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearUser())
  }

  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img className="main-nav-logo-image" src={logo} alt="Argent Bank Logo" />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <div>
        {showUserNav ? (
          <>
            <NavLink className="main-nav-item" to="/profile">
              <i className="fa fa-user-circle"></i>
              {firstName || 'Profile'}
            </NavLink>
            <Link className="main-nav-item" to="/" onClick={handleLogout}>
              <i className="fa fa-sign-out"></i>
              Sign Out
            </Link>
          </>
        ) : (
          <NavLink className="main-nav-item" to="/login">
            <i className="fa fa-user-circle"></i>
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  )
}
