import { useSiteSettings, useWorks } from '../data/queries'
import { useScrollRestore } from '../hooks/useScrollRestore'
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
