import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AccountCard from '../components/account/AccountCard'
import { TOKEN_STORAGE_KEY } from '../features/auth/authSlice'
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
    description: 'Available Balance',
    category: 'checking',
    categoryLabel: 'Checking',
    accountNumber: 'x8349'
  },
  {
    id: 'savings-6712',
    title: 'Argent Bank Savings (x6712)',
    amount: '$10,928.42',
    description: 'Available Balance',
    category: 'savings',
    categoryLabel: 'Savings',
    accountNumber: 'x6712'
  },
  {
    id: 'credit-card-5201',
    title: 'Argent Bank Credit Card (x5201)',
    amount: '$184.30',
    description: 'Current Balance',
    category: 'credit',
    categoryLabel: 'Credit Card',
    accountNumber: 'x5201'
  }
]

const NAME_VALIDATION_MESSAGE = 'Enter a first and last name of up to 80 characters each.'

function getTokenStorageLabel() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
      ? 'localStorage · Persistent'
      : 'sessionStorage · Tab'
  } catch {
    return 'sessionStorage · Tab'
  }
}

export default function Profile() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const fullName = useSelector(selectUserFullName)
  const status = useSelector(selectUserStatus)
  const error = useSelector(selectUserError)
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [validationError, setValidationError] = useState(null)
  const [savedNotice, setSavedNotice] = useState(null)
  const isLoading = status === 'loading'
  const storageLabel = getTokenStorageLabel()

  useEffect(() => {
    if (!user.id && status === 'idle') {
      dispatch(getProfile())
    }
  }, [dispatch, status, user.id])

  useEffect(() => {
    setFirstName(user.firstName)
    setLastName(user.lastName)
  }, [user.firstName, user.lastName])

  const trimmedFirst = firstName.trim()
  const trimmedLast = lastName.trim()
  const activeError = validationError || error
  const firstInvalid = Boolean(validationError) && (!trimmedFirst || trimmedFirst.length > 80)
  const lastInvalid = Boolean(validationError) && (!trimmedLast || trimmedLast.length > 80)

  const handleEdit = () => {
    setValidationError(null)
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setValidationError(null)
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setIsEditing(false)
  }

  const handleFirstNameChange = event => {
    setFirstName(event.target.value)
    if (validationError) setValidationError(null)
  }

  const handleLastNameChange = event => {
    setLastName(event.target.value)
    if (validationError) setValidationError(null)
  }

  const handleSave = async event => {
    event.preventDefault()

    if (
      !trimmedFirst ||
      !trimmedLast ||
      trimmedFirst.length > 80 ||
      trimmedLast.length > 80
    ) {
      setValidationError(NAME_VALIDATION_MESSAGE)
      return
    }

    setValidationError(null)

    try {
      await dispatch(updateProfile({ firstName: trimmedFirst, lastName: trimmedLast })).unwrap()
      setIsEditing(false)
      setSavedNotice({
        fullName: `${trimmedFirst} ${trimmedLast}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      })
    } catch {
      // Server error messages are stored in Redux and rendered below.
    }
  }

  return (
    <main className="ab-main">
      <div className="ab-container">
        <div className="profile-shell">
          <section className="profile-identity-card header" aria-label="Account holder profile">
            <div className="identity-top">
              <div>
                <p className="identity-greeting">Welcome back</p>
                <h1 className="identity-name" id="welcomeHeading">
                  {fullName ? `${fullName}!` : isLoading ? 'Loading profile…' : 'Profile'}
                </h1>
                <div className="identity-badges">
                  {user.email ? <span className="meta-pill">{user.email}</span> : null}
                  <span className="meta-pill">{storageLabel}</span>
                  <span className="meta-pill">Account Holder</span>
                </div>
              </div>

              <div className="identity-actions">
                {!user.id && status === 'failed' ? (
                  <button
                    className="btn-secondary edit-button"
                    type="button"
                    onClick={() => dispatch(getProfile())}
                  >
                    Retry
                  </button>
                ) : null}
                <button
                  className="btn-primary edit-button"
                  type="button"
                  id="editNameBtn"
                  onClick={handleEdit}
                  disabled={isLoading || !user.id || isEditing}
                >
                  Edit Name
                </button>
              </div>
            </div>

            {!isEditing && error ? (
              <p className="form-error profile-banner-error" role="alert">
                {error}
              </p>
            ) : null}

            {savedNotice && !isEditing ? (
              <div className="banner-alert is-success save-success-banner" id="saveSuccessBanner" role="status">
                <div>
                  <strong>Profile updated</strong> — Account holder name saved as{' '}
                  <span className="mono">{savedNotice.fullName}</span>.
                  <div className="save-timestamp mono">Saved at {savedNotice.timestamp}</div>
                </div>
                <button
                  className="btn-ghost"
                  type="button"
                  onClick={() => setSavedNotice(null)}
                >
                  Dismiss
                </button>
              </div>
            ) : null}

            {isEditing ? (
              <form className="edit-name-panel edit-name-form" id="editNameForm" onSubmit={handleSave} noValidate>
                <div className="edit-name-heading">
                  <h2 className="edit-name-title">Edit Account Holder Name</h2>
                  <span className="form-hint">Trimmed · 1 to 80 characters each</span>
                </div>

                <div className="edit-inputs-grid edit-name-inputs">
                  <div className="form-field edit-field">
                    <label className="form-label" htmlFor="first-name-input">
                      <span>First name</span>
                      <span className="form-hint mono">{trimmedFirst.length}/80</span>
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="first-name-input"
                      aria-label="First name"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      aria-invalid={firstInvalid || undefined}
                      disabled={isLoading}
                      maxLength={80}
                      required
                    />
                  </div>

                  <div className="form-field edit-field">
                    <label className="form-label" htmlFor="last-name-input">
                      <span>Last name</span>
                      <span className="form-hint mono">{trimmedLast.length}/80</span>
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="last-name-input"
                      aria-label="Last name"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={handleLastNameChange}
                      aria-invalid={lastInvalid || undefined}
                      disabled={isLoading}
                      maxLength={80}
                      required
                    />
                  </div>
                </div>

                {activeError ? (
                  <p className="form-error" id="profileError" role="alert">
                    {activeError}
                  </p>
                ) : null}

                <div className="edit-form-actions edit-name-actions">
                  <button className="btn-primary edit-button" type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="btn-secondary edit-button secondary"
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
          </section>

          <div className="profile-main-col">
            <section className="summary-strip" aria-label="Account summary totals">
              <div className="summary-card">
                <div className="summary-label-row">
                  <p className="summary-label">Total Cash Available</p>
                  <span className="sample-badge">Sample data</span>
                </div>
                <p className="summary-amount tabular-nums">$13,011.21</p>
                <p className="summary-sub">Checking (x8349) + Savings (x6712)</p>
              </div>

              <div className="summary-card">
                <div className="summary-label-row">
                  <p className="summary-label">Credit Card Balance</p>
                  <span className="sample-badge">Sample data</span>
                </div>
                <p className="summary-amount tabular-nums">$184.30</p>
                <p className="summary-sub">Current Balance · Credit Card (x5201)</p>
              </div>
            </section>

            <div className="accounts-header">
              <h2 className="accounts-title">Accounts Overview</h2>
              <span className="sample-badge">Sample data · Static balances</span>
            </div>

            <div className="accounts-list">
              {accounts.map(account => (
                <AccountCard
                  key={account.id}
                  title={account.title}
                  amount={account.amount}
                  description={account.description}
                  category={account.category}
                  categoryLabel={account.categoryLabel}
                  accountNumber={account.accountNumber}
                />
              ))}
            </div>

            <div className="proposal-footer-note">
              <span>
                <strong>Transaction history excluded:</strong> Transactions remain an API proposal
                in <span className="mono">docs/swagger-transactions.yaml</span> and are outside the
                current Express backend.
              </span>
              <span className="sample-badge">Balances: Sample data</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
