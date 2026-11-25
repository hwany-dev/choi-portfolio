import { useEffect, useState, type ReactNode } from 'react'
import { useSiteSettings, useWorks } from '../data/queries'
import { buildCategories } from '../data/parse'
import { useActiveSection, useSectionRef } from '../hooks/useActiveSection'
import { ScrollTrigger } from '../lib/lenis'
import { scrollToSection } from '../lib/navigation'
import { isSectionId, SECTIONS, type Section, type SectionId } from '../lib/sections'
import Home from '../sections/Home/Home'
import BarExpandTransition from '../components/transitions/BarExpandTransition'
import PlusExpandTransition from '../components/transitions/PlusExpandTransition'

/** 섹션 시작부 전환 연출 (§3-8). 중앙 라벨은 하드코딩 허용 항목 */
const INTROS: Partial<Record<SectionId, ReactNode>> = {
  works: <BarExpandTransition lines={['Selected', 'Works']} />,
  contact: <PlusExpandTransition />,
}

/**
 * 임시: 섹션 뼈대. 5단계부터 sections/(Profile, Works, ProjectList, Contact)로 하나씩 교체된다.
 * [data-anchor] = 내비 클릭 시 도착 지점 (전환 연출 뒤 콘텐츠 시작).
 */
function PlaceholderSection({ section, children }: { section: Section; children?: ReactNode }) {
  const ref = useSectionRef(section.id)
  return (
    <section id={section.id} ref={ref} data-theme={section.theme}>
      {INTROS[section.id]}
      <div
        data-anchor
        className="grid grid-lines"
        style={{ minHeight: '100svh', alignContent: 'start', paddingBlock: 'calc(var(--nav-h, 0px) + var(--gutter))' }}
      >
        <p className="col-label" style={{ fontSize: 'var(--fs-caption)' }}>
          {section.label}
        </p>
        <div className="col-content">{children}</div>
      </div>
    </section>
  )
}

/** 진입 시 hash가 있으면 해당 섹션으로, 스크롤 중엔 현재 섹션으로 hash 갱신 */
function useHashSync(ready: boolean) {
  const [initialHash] = useState(() => window.location.hash.slice(1))
  const [restored, setRestored] = useState(!isSectionId(initialHash))
  const active = useActiveSection()

  useEffect(() => {
    if (restored || !ready || !isSectionId(initialHash)) return
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      scrollToSection(initialHash, true)
      setRestored(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [ready, restored, initialHash])

  useEffect(() => {
    if (!restored || !active) return
    const { pathname, search } = window.location
    history.replaceState(history.state, '', active === 'home' ? pathname + search : `#${active}`)
  }, [active, restored])
}

export default function HomePage() {
  const settings = useSiteSettings()
  const works = useWorks()
  useHashSync(!settings.isPending && !works.isPending)

  return (
    <main>
      <Home />
      {SECTIONS.filter((s) => s.id !== 'home').map((section) => (
        <PlaceholderSection key={section.id} section={section}>
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
