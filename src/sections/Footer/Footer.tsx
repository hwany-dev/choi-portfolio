import { useCallback, useLayoutEffect, useRef } from 'react'
import { useSiteSettings } from '../../data/queries'
import { useSectionRef } from '../../hooks/useActiveSection'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { gsap, ScrollTrigger } from '../../lib/lenis'
import { scrollToSection } from '../../lib/navigation'
import GridLines from '../../components/GridLines/GridLines'
import Wordmark from '../../components/Wordmark/Wordmark'
import styles from './Footer.module.css'

/** FOOTER (§4-6, 14·15 캡처): © 줄 + Back to top → 하단이 잘린 거대 워드마크 (scrub reveal) */
export default function Footer() {
  const { data: settings } = useSiteSettings()
  const reduced = usePrefersReducedMotion()
  const wordmarkEl = useRef<HTMLDivElement>(null)
  const sectionRef = useSectionRef('footer')
  const title = settings?.siteTitle ?? ''

  // 페이지 끝에 다가갈수록 글자가 아래에서 올라온다 (마스크 안에서)
  useLayoutEffect(() => {
    const el = wordmarkEl.current
    if (!el || !title || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-letter-inner]'),
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: 'none',
          stagger: 0.04,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: () => ScrollTrigger.maxScroll(window),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [title, reduced])

  const toTop = useCallback(() => scrollToSection('home'), [])

  return (
    <footer id="footer" ref={sectionRef} className={styles.footer}>
      <div data-anchor className={styles.content}>
        <GridLines />

        <div className={`grid ${styles.info}`}>
          {title && (
            <p className={styles.copyright}>
              © {new Date().getFullYear()} {title}
            </p>
          )}
          <button type="button" className={styles.toTop} onClick={toTop}>
            Back to top ↑
          </button>
        </div>

        {title && (
          <div ref={wordmarkEl} className={styles.wordmark}>
            <Wordmark text={title} />
          </div>
        )}
      </div>
    </footer>
  )
}
