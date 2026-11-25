import { useSiteSettings, useWorks } from '../data/queries'
import { buildCategories } from '../data/parse'
import { useTheme } from '../hooks/useTheme'

/**
 * 임시: 1~2단계 연결 확인용 화면.
 * 4단계부터 sections/(Home, Profile, Works, ProjectList, Contact)로 교체된다.
 */
export default function HomePage() {
  const settings = useSiteSettings()
  const works = useWorks()
  const { inverted, toggle } = useTheme()

  return (
    <main data-theme="light" className="grid grid-lines" style={{ minHeight: '100svh', alignContent: 'start' }}>
      <div className="col-label" style={{ paddingBlock: 'var(--gutter)', fontSize: 'var(--fs-caption)' }}>
        <p>settings/site: {settings.isPending ? '…' : settings.isError ? 'error' : 'ok'}</p>
        <p>works: {works.isPending ? '…' : works.isError ? 'error' : works.data.length}</p>
        <button type="button" onClick={toggle} style={{ textDecoration: 'underline' }}>
          invert color ({inverted ? 'on' : 'off'})
        </button>
      </div>
      <div className="col-content" style={{ paddingBlock: 'var(--gutter)' }}>
        <h1 style={{ fontSize: 'var(--fs-lead-xl)', lineHeight: 'var(--lh-large)', whiteSpace: 'pre-line' }}>
          {settings.data?.heroCopy}
        </h1>
        {works.data && (
          <p style={{ fontSize: 'var(--fs-caption)', marginTop: '1em' }}>
            {buildCategories(works.data)
              .map((c) => `${c.label} (${c.count})`)
              .join('  ')}
          </p>
        )}
      </div>
    </main>
  )
}
