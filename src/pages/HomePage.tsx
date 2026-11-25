import type { ReactNode } from 'react'
import { useSiteSettings, useWorks } from '../data/queries'
import { buildCategories } from '../data/parse'
import { useSectionRef } from '../hooks/useActiveSection'
import { SECTIONS, type Section, type SectionId } from '../lib/sections'
import BarExpandTransition from '../components/transitions/BarExpandTransition'
import PlusExpandTransition from '../components/transitions/PlusExpandTransition'

/** 섹션 시작부 전환 연출 (§3-8). 중앙 라벨은 하드코딩 허용 항목 */
const INTROS: Partial<Record<SectionId, ReactNode>> = {
  works: <BarExpandTransition lines={['Selected', 'Works']} />,
  contact: <PlusExpandTransition />,
}

/**
 * 임시: 섹션 뼈대 + 연결 확인용.
 * 4단계부터 sections/(Home, Profile, Works, ProjectList, Contact)로 하나씩 교체된다.
 */
function PlaceholderSection({ section, children }: { section: Section; children?: ReactNode }) {
  const ref = useSectionRef(section.id)
  return (
    <section id={section.id} ref={ref} data-theme={section.theme}>
      {INTROS[section.id]}
      <div
        className="grid grid-lines"
        style={{ minHeight: '100svh', alignContent: 'start', paddingBlock: 'var(--gutter)' }}
      >
        <p className="col-label" style={{ fontSize: 'var(--fs-caption)' }}>
          {section.label}
        </p>
        <div className="col-content">{children}</div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const settings = useSiteSettings()
  const works = useWorks()

  return (
    <main>
      {SECTIONS.map((section) => (
        <PlaceholderSection key={section.id} section={section}>
          {section.id === 'home' && (
            <>
              <h1 style={{ fontSize: 'var(--fs-lead-xl)', lineHeight: 'var(--lh-large)', whiteSpace: 'pre-line' }}>
                {settings.data?.heroCopy}
              </h1>
              <p style={{ fontSize: 'var(--fs-caption)', marginTop: '1em' }}>
                settings/site: {settings.isPending ? '…' : settings.isError ? 'error' : 'ok'} · works:{' '}
                {works.isPending ? '…' : works.isError ? 'error' : works.data.length}
              </p>
            </>
          )}
          {section.id === 'works' && works.data && (
            <p style={{ fontSize: 'var(--fs-caption)' }}>
              {buildCategories(works.data)
                .map((c) => `${c.label} (${c.count})`)
                .join('  ')}
            </p>
          )}
        </PlaceholderSection>
      ))}
    </main>
  )
}
