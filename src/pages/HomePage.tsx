import { useSiteSettings, useWorks } from '../data/queries'
import { useActiveSection } from '../hooks/useActiveSection'
import { usePageTheme } from '../hooks/usePageTheme'
import { useScrollRestore } from '../hooks/useScrollRestore'
import { SECTIONS } from '../lib/sections'
import Home from '../sections/Home/Home'
import Profile from '../sections/Profile/Profile'
import Works from '../sections/Works/Works'
import ProjectList from '../sections/ProjectList/ProjectList'
import Footer from '../sections/Footer/Footer'

/** 원페이지: HOME → PROFILE → WORKS → PROJECT LIST → FOOTER */
export default function HomePage() {
  const settings = useSiteSettings()
  const works = useWorks()
  const { restored } = useScrollRestore(!settings.isPending && !works.isPending)

  // 섹션 경계가 화면 가운데를 지나면 페이지 전체가 그 섹션 테마로 부드럽게 바뀐다
  const active = useActiveSection()
  usePageTheme(SECTIONS.find((s) => s.id === active)?.theme ?? 'light')

  return (
    <>
      <main>
        <Home />
        <Profile />
        <Works initial={restored} />
        <ProjectList />
      </main>
      <Footer />
    </>
  )
}
