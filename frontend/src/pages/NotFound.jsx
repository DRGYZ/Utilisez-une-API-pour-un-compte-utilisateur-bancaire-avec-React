import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="ab-main not-found">
      <div className="ab-container">
        <section className="signin-card not-found-content" aria-labelledby="notFoundHeading">
          <p className="eyebrow">404 · Route Not Found</p>
          <h1 className="signin-title" id="notFoundHeading">
            Page not found
          </h1>
          <p className="signin-subtitle not-found-copy">
            The requested Argent Bank view does not exist. Return to the main vault overview.
          </p>
          <Link className="btn-primary sign-in-button" to="/">
            Return home
          </Link>
        </section>
      </div>
    </main>
  )
}
