import { Link } from 'react-router'

export default function NotFound() {
  return (
    <main data-theme="light" className="grid" style={{ minHeight: '100svh', alignContent: 'center' }}>
      <div className="col-content">
        <h1 style={{ fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-large)' }}>Page not found</h1>
        <Link to="/" style={{ textDecoration: 'underline' }}>
          Back to home
        </Link>
      </div>
    </main>
  )
}
