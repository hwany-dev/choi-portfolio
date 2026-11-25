import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/lenis'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import styles from './transitions.module.css'

interface Props {
  /** 덮은 뒤 중앙에 뜨는 작은 라벨 (줄 단위) */
  lines: readonly string[]
}

/**
 * light → dark 전환 (PROFILE → WORKS). 03~05 캡처.
 * 화면 중앙의 얇은 ink 세로 바가 스크롤에 맞춰 좌우로 넓어져 화면을 덮고, 중앙 라벨이 나타난다.
 * reduced-motion이면 렌더하지 않는다 → 단순 배경 전환.
 */
export default function BarExpandTransition({ lines }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      const bar = el.querySelector('[data-bar]')
      const label = el.querySelector('[data-label]')
      const css = getComputedStyle(el)
      const x = css.getPropertyValue('--bar-inset-x').trim()
      const y = css.getPropertyValue('--bar-inset-y').trim()
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true },
        })
        .fromTo(bar, { clipPath: `inset(${y} ${x} ${y} ${x})` }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 0.65 })
        .fromTo(label, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, ease: 'power3.out', duration: 0.2 }, 0.6)
        .to({}, { duration: 0.2 }) // 덮인 상태로 잠깐 유지
    }, el)
    return () => ctx.revert()
  }, [reduced])

  if (reduced) return null

  return (
    <div ref={root} className={styles.track} aria-hidden="true">
      <div className={`${styles.stage} grid-lines`} data-theme="light">
        <div className={`${styles.bar} grid-lines`} data-theme="dark" data-bar />
        <p className={styles.label} data-label>
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>
    </div>
  )
}
