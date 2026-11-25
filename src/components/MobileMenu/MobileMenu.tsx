import { useEffect, useRef } from 'react'
import { useSiteSettings } from '../../data/queries'
import { useActiveSection } from '../../hooks/useActiveSection'
import { startScroll, stopScroll } from '../../lib/lenis'
import { menuOpen } from '../../lib/navigation'
import { useGoToSection } from '../../hooks/useGoToSection'
import { NAV_SECTIONS, type NavSectionId } from '../../lib/sections'
import PlusIcon from '../Nav/PlusIcon'
import styles from './MobileMenu.module.css'

/** 모바일(≤768) 풀스크린 메뉴. 열려 있는 동안 스크롤 정지, Esc로 닫기 */
export default function MobileMenu() {
  const open = menuOpen.useValue()
  const active = useActiveSection()
  const { data: settings } = useSiteSettings()
  const goTo = useGoToSection()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    stopScroll()
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') menuOpen.set(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      startScroll()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (id: NavSectionId) => {
    menuOpen.set(false)
    requestAnimationFrame(() => goTo(id))
  }

  return (
    <div
      id="mobile-menu"
      className={styles.overlay}
      data-theme="dark"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
    >
      <div className={styles.top}>
        <button type="button" className={styles.plus} onClick={() => go('home')} aria-label="Back to top">
          <PlusIcon />
        </button>
        <button type="button" ref={closeRef} onClick={() => menuOpen.set(false)}>
          Close
        </button>
      </div>

      <ul className={styles.list}>
        {NAV_SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`/#${s.id}`}
              className={styles.link}
              data-active={active === s.id}
              onClick={(e) => {
                e.preventDefault()
                go(s.id)
              }}
            >
              {s.label}
            </a>
          </li>
        ))}
        {settings?.instagramUrl && (
          <li>
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
              Instagram ↗
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}
