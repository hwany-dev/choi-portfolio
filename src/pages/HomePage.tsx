import type { ReactNode } from 'react'
import { useSiteSettings, useWorks } from '../data/queries'
import { useSectionRef } from '../hooks/useActiveSection'
import { useScrollRestore } from '../hooks/useScrollRestore'
import { SECTIONS, type Section, type SectionId } from '../lib/sections'
import Home from '../sections/Home/Home'
import Profile from '../sections/Profile/Profile'
import Works from '../sections/Works/Works'
import ProjectList from '../sections/ProjectList/ProjectList'
import PlusExpandTransition from '../components/transitions/PlusExpandTransition'

/** 섹션 시작부 전환 연출 (§3-8). 중앙 라벨은 하드코딩 허용 항목 */
const INTROS: Partial<Record<SectionId, ReactNode>> = {
  footer: <PlusExpandTransition />,
}

/**
 * 임시: 섹션 뼈대. 9단계에서 sections/Footer로 교체된다.
 * [data-anchor] = 내비 클릭 시 도착 지점 (전환 연출 뒤 콘텐츠 시작).
 */
function PlaceholderSection({ section }: { section: Section }) {
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
      </div>
    </section>
  )
}

export default function HomePage() {
  const settings = useSiteSettings()
  const works = useWorks()
  const { restored } = useScrollRestore(!settings.isPending && !works.isPending)

  return (
    <main>
      <Home />
      <Profile />
      <Works initial={restored} />
      <ProjectList />
      {SECTIONS.filter((s) => s.id === 'footer').map((section) => (
        <PlaceholderSection key={section.id} section={section} />
      ))}
    </main>
  )
}
