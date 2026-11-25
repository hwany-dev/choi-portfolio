import { Link } from 'react-router'
import { usePageTheme } from '../hooks/usePageTheme'

export default function NotFound() {
  usePageTheme('light')
  return (
    <main className="grid" style={{ minHeight: '100svh', alignContent: 'center' }}>
      <div className="col-content">
        <h1 style={{ fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-large)' }}>Page not found</h1>
        <Link to="/" style={{ textDecoration: 'underline' }}>
          Back to home
        </Link>
      </div>
    </main>
  )
}
