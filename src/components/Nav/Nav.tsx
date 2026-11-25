import { useLayoutEffect, useRef, type MouseEvent } from 'react'
import { useSiteSettings } from '../../data/queries'
import { useActiveSection } from '../../hooks/useActiveSection'
import { ScrollTrigger } from '../../lib/lenis'
import { menuOpen, navPinned } from '../../lib/navigation'
import { useGoToSection } from '../../hooks/useGoToSection'
import { NAV_SECTIONS, type NavSectionId } from '../../lib/sections'
import PlusIcon from './PlusIcon'
import { useNavProgress } from './useNavProgress'
import styles from './Nav.module.css'

/** 탭 시작 컬럼 (grid.css의 --col-nav-*) */
const NAV_COLUMN: Record<NavSectionId, string> = {
  home: 'var(--col-nav-home)',
  profile: 'var(--col-nav-profile)',
  works: 'var(--col-nav-works)',
  'project-list': 'var(--col-nav-list)',
}

interface Props {
  /** inline: HOME 워드마크 아래 문서 흐름 안 / fixed: 상단에 닿은 뒤 FixedLayer에서 (difference blend) */
  variant: 'inline' | 'fixed'
}

export default function Nav({ variant }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isFixed = variant === 'fixed'
  const active = useActiveSection()
  const pinned = navPinned.useValue()
  const open = menuOpen.useValue()
  const { data: settings } = useSiteSettings()
  const goTo = useGoToSection()

  // inline 내비가 화면 상단에 닿으면 pinned → 고정 내비로 교체
  useLayoutEffect(() => {
    const el = ref.current
    if (isFixed || !el) return
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'max',
      onToggle: (self) => navPinned.set(self.isActive),
    })
    navPinned.set(trigger.isActive)
    return () => {
      trigger.kill()
      navPinned.set(false)
    }
  }, [isFixed])

  useNavProgress(ref, isFixed)

  const hidden = isFixed ? !pinned : pinned

  const onTab = (id: NavSectionId) => (e: MouseEvent) => {
    e.preventDefault()
    goTo(id)
  }

  return (
    <nav
      ref={ref}
      className={`${styles.nav} ${isFixed ? styles.fixed : ''}`}
      data-hidden={hidden}
      aria-label="Main"
      aria-hidden={hidden || undefined}
      inert={hidden}
    >
      <button type="button" className={styles.plus} onClick={() => goTo('home')} aria-label="Back to top">
        <PlusIcon />
      </button>

      {NAV_SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`/#${s.id}`}
          className={styles.item}
          style={{ gridColumnStart: NAV_COLUMN[s.id] }}
          data-active={active === s.id}
          aria-current={active === s.id ? 'location' : undefined}
          data-nav-tick
          onClick={onTab(s.id)}
        >
          {s.label}
        </a>
      ))}

      {settings?.instagramUrl && (
        <a
          href={settings.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.item}
          style={{ gridColumnStart: 'var(--col-nav-instagram)' }}
        >
          Instagram ↗
        </a>
      )}

      <button
        type="button"
        className={styles.menuButton}
        onClick={() => menuOpen.set(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        Menu
      </button>

      <span className={styles.progress} data-nav-progress aria-hidden="true" />
    </nav>
  )
}
