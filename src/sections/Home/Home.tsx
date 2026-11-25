import { useCallback, useLayoutEffect, useRef } from 'react'
import { useSiteSettings } from '../../data/queries'
import { useSectionRef } from '../../hooks/useActiveSection'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { gsap } from '../../lib/lenis'
import GridLines from '../../components/GridLines/GridLines'
import Nav from '../../components/Nav/Nav'
import Wordmark from '../../components/Wordmark/Wordmark'
import styles from './Home.module.css'

/** HOME (§4-1, 01·02 캡처) */
export default function Home() {
  const { data: settings, isError } = useSiteSettings()
  const reduced = usePrefersReducedMotion()
  const sectionEl = useRef<HTMLElement | null>(null)
  const contentEl = useRef<HTMLDivElement>(null)
  const register = useSectionRef('home')
  const sectionRef = useCallback(
    (el: HTMLElement | null) => {
      sectionEl.current = el
      return register(el)
    },
    [register],
  )

  const ready = Boolean(settings)

  useLayoutEffect(() => {
    const section = sectionEl.current
    const content = contentEl.current
    if (!ready || reduced || !section || !content) return
    const ctx = gsap.context(() => {
      // 로드 시: 소문구·카피·스크롤 큐가 워드마크 뒤를 이어 올라온다
      gsap.from(content.querySelectorAll('[data-reveal]'), {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.35,
      })
      // 스크롤 시: 카피가 살짝 위로 drift + 흐려짐
      gsap.to(content, {
        y: -80,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, section)
    return () => ctx.revert()
  }, [ready, reduced])

  return (
    <section id="home" ref={sectionRef} data-theme="light" className={styles.home}>
      <GridLines diagonal />

      {settings?.siteTitle ? (
        <Wordmark as="h1" text={settings.siteTitle} reveal />
      ) : (
        <div className={styles.wordmarkSkeleton} />
      )}

      <Nav variant="inline" />

      <div ref={contentEl} className={`grid ${styles.content}`}>
        {settings?.heroTagline && (
          <p className={`col-label ${styles.tagline}`} data-reveal>
            {settings.heroTagline}
          </p>
        )}
        {settings?.heroCopy && (
          <p className={`col-content ${styles.copy}`} data-reveal>
            {settings.heroCopy}
          </p>
        )}
        {isError && <p className={`col-content ${styles.tagline}`}>콘텐츠를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</p>}

        <div className={`col-content ${styles.cue}`} data-reveal>
          <span className={styles.cueLine} aria-hidden="true" />
          <span>Scroll to discover</span>
        </div>
      </div>
    </section>
  )
}
