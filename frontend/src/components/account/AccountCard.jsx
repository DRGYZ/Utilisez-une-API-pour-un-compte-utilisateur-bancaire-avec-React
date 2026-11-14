export default function AccountCard({
  title,
  amount,
  description,
  category = 'checking',
  categoryLabel = 'Account',
  accountNumber
}) {
  return (
    <article className="account-card account" data-kind={category}>
      <div className="account-left account-content-wrapper">
        <div className="account-tag-row">
          <span className="account-kind-pill">{categoryLabel}</span>
          {accountNumber ? <span className="account-number-pill">{accountNumber}</span> : null}
          <span className="sample-badge">Sample data</span>
        </div>
        <h3 className="account-name account-title">{title}</h3>
        <p className="account-tx-note">Transactions unavailable · API proposal only</p>
      </div>
      <div className="account-right account-content-wrapper cta">
        <p className="account-balance account-amount tabular-nums">{amount}</p>
        <p className="account-balance-type account-amount-description">{description}</p>
      </div>
    </article>
  )
}
