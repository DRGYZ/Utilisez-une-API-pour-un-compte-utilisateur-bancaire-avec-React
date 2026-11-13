import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AccountCard from '../components/account/AccountCard'
import {
  getProfile,
  selectUser,
  selectUserError,
  selectUserFullName,
  selectUserStatus,
  updateProfile
} from '../features/user/userSlice'

const accounts = [
  {
    id: 'checking-8349',
    title: 'Argent Bank Checking (x8349)',
    amount: '$2,082.79',
    description: 'Available Balance'
  },
  {
    id: 'savings-6712',
    title: 'Argent Bank Savings (x6712)',
    amount: '$10,928.42',
    description: 'Available Balance'
  },
  {
    id: 'credit-card-5201',
    title: 'Argent Bank Credit Card (x5201)',
    amount: '$184.30',
    description: 'Current Balance'
  }
]

export default function Profile() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const fullName = useSelector(selectUserFullName)
  const status = useSelector(selectUserStatus)
  const error = useSelector(selectUserError)
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const isLoading = status === 'loading'

  useEffect(() => {
    if (!user.id && status === 'idle') {
      dispatch(getProfile())
    }
  }, [dispatch, status, user.id])

  useEffect(() => {
    setFirstName(user.firstName)
    setLastName(user.lastName)
  }, [user.firstName, user.lastName])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setIsEditing(false)
  }

  const handleSave = async event => {
    event.preventDefault()

    try {
      await dispatch(updateProfile({ firstName, lastName })).unwrap()
      setIsEditing(false)
    } catch {
      // Error messages are stored in Redux and rendered below.
    }
  }

  return (
    <main className="main bg-dark">
      <div className="header">
        {isEditing ? (
          <form className="edit-name-form" onSubmit={handleSave}>
            <h1>Welcome back</h1>
            <div className="edit-name-inputs">
              <input
                type="text"
                aria-label="First name"
                value={firstName}
                onChange={event => setFirstName(event.target.value)}
                disabled={isLoading}
                maxLength={80}
                required
              />
              <input
                type="text"
                aria-label="Last name"
                value={lastName}
                onChange={event => setLastName(event.target.value)}
                disabled={isLoading}
                maxLength={80}
                required
              />
            </div>
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="edit-name-actions">
              <button className="edit-button secondary" type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                className="edit-button secondary"
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1>
              Welcome back
              <br />
              {fullName ? `${fullName}!` : isLoading ? 'Loading profile…' : 'Profile'}
            </h1>
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}
            {!user.id && status === 'failed' ? (
              <button className="edit-button" type="button" onClick={() => dispatch(getProfile())}>
                Retry
              </button>
            ) : null}
            <button
              className="edit-button"
              type="button"
              onClick={handleEdit}
              disabled={isLoading || !user.id}
            >
              Edit Name
            </button>
          </>
        )}
      </div>
      <h2 className="sr-only">Example accounts</h2>
      {accounts.map(account => (
        <AccountCard
          key={account.id}
          title={account.title}
          amount={account.amount}
          description={account.description}
        />
      ))}
    </main>
  )
}
