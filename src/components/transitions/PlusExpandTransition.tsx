import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/lenis'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import styles from './transitions.module.css'

/** 십자가 화면을 완전히 덮는 팔 두께(절반) — 화면 긴 변의 절반 + 여유 1px */
const coverHalfThickness = () => `${Math.max(window.innerWidth, window.innerHeight) / 2 + 1}px`

/**
 * dark → light 전환 (PROJECT LIST → FOOTER). 11~12 캡처.
 * 중앙에 paper색 + 가 작게 나타나 스크롤에 맞춰 커지며 화면을 덮는다.
 * reduced-motion이면 렌더하지 않는다 → 단순 배경 전환.
 */
export default function PlusExpandTransition() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .fromTo('[data-plus]', { '--h': '0px' }, { '--h': coverHalfThickness, ease: 'power2.in', duration: 0.85 })
        .to({}, { duration: 0.15 })
    }, el)
    return () => ctx.revert()
  }, [reduced])

  if (reduced) return null

  return (
    <div ref={root} className={styles.track} aria-hidden="true">
      <div className={`${styles.stage} grid-lines`} data-theme="dark">
        <div className={`${styles.plus} grid-lines`} data-theme="light" data-plus />
      </div>
    </div>
  )
}
