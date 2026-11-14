import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import bankTree from '../assets/img/bank-tree.jpeg'
import chatIcon from '../assets/img/icon-chat.png'
import moneyIcon from '../assets/img/icon-money.png'
import securityIcon from '../assets/img/icon-security.png'
import FeatureCard from '../components/FeatureCard'
import { selectIsAuthenticated } from '../features/auth/authSlice'

const PREVIEW_BALANCES = [
  { name: 'Checking x8349', value: '$2,082.79' },
  { name: 'Savings x6712', value: '$10,928.42' },
  { name: 'Credit Card x5201', value: '$184.30' }
]

export default function Home() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <main className="ab-main">
      <div className="ab-container">
        <div className="hero-grid">
          <section className="hero-copy-card" aria-labelledby="homeHeroHeading">
            <div>
              <p className="eyebrow">Personal Banking · Direct Vault</p>
              <h2 className="hero-title" id="homeHeroHeading">
                No fees. No minimum deposit. High interest rates.
              </h2>
              <p className="hero-sub">
                Open a savings account with Argent Bank today and review your account balances in a
                clear, protected workspace built for everyday clarity.
              </p>
            </div>

            <div className="hero-metrics" aria-label="Core account terms">
              <div className="hero-metric">
                <p className="hero-metric-val">$0</p>
                <p className="hero-metric-label">Monthly account fees</p>
              </div>
              <div className="hero-metric">
                <p className="hero-metric-val">$0</p>
                <p className="hero-metric-label">Minimum deposit</p>
              </div>
              <div className="hero-metric">
                <p className="hero-metric-val">24/7</p>
                <p className="hero-metric-label">Protected access</p>
              </div>
            </div>

            <div className="hero-actions">
              <Link className="btn-primary" to={isAuthenticated ? '/profile' : '/login'}>
                Access Your Accounts
              </Link>
              <Link className="btn-secondary" to="/login">
                Explore Demo Accounts
              </Link>
            </div>
          </section>

          <div className="hero-media-card">
            <div className="hero-photo-wrap">
              <img
                className="hero-photo"
                src={bankTree}
                alt="Sprouting plant growing out of coins in a glass jar"
              />
            </div>
            <div className="hero-media-footer">
              <div className="hero-media-caption-row">
                <p className="hero-media-title">Account overview preview</p>
                <span className="sample-badge">Sample data · Demo accounts</span>
              </div>
              <div className="hero-telemetry-grid">
                {PREVIEW_BALANCES.map(item => (
                  <div className="hero-telemetry-item" key={item.name}>
                    <p className="hero-telemetry-name">{item.name}</p>
                    <p className="hero-telemetry-val tabular-nums">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="features-grid features" aria-label="Argent Bank benefits">
          <h2 className="sr-only">Features</h2>
          <FeatureCard icon={chatIcon} alt="Chat Icon" title="You are our #1 priority">
            Need to talk to a representative? You can get in touch through our 24/7 chat or
            through a phone call in less than 5 minutes.
          </FeatureCard>
          <FeatureCard
            icon={moneyIcon}
            alt="Money Icon"
            title="More savings means higher rates"
          >
            The more you save with us, the higher your interest rate will be!
          </FeatureCard>
          <FeatureCard icon={securityIcon} alt="Security Icon" title="Security you can trust">
            We use top of the line encryption to make sure your data and money is always safe.
          </FeatureCard>
        </section>
      </div>
    </main>
  )
}
