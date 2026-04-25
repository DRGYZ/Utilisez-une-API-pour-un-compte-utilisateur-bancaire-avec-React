import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="main bg-dark not-found">
      <section className="not-found-content">
        <h1>Page not found</h1>
        <Link className="sign-in-button" to="/">
          Return home
        </Link>
      </section>
    </main>
  )
}
