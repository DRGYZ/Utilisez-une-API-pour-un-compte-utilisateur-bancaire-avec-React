import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { selectToken } from './features/auth/authSlice'
import { getProfile, selectUserStatus } from './features/user/userSlice'

export default function App() {
  const dispatch = useDispatch()
  const token = useSelector(selectToken)
  const userStatus = useSelector(selectUserStatus)

  useEffect(() => {
    if (token && userStatus === 'idle') {
      dispatch(getProfile())
    }
  }, [dispatch, token, userStatus])

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
