import { Fragment, useLayoutEffect, useRef, type ElementType } from 'react'
import { gsap } from '../../lib/lenis'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

interface Props {
  text: string
  as?: ElementType
  className?: string
  /** ScrollTrigger 구간 (기본: 블록 상단이 화면 85% → 하단이 화면 55%) */
  start?: string
  end?: string
}

/**
 * 단어 단위 opacity scrub (§3-9). 읽는 위치에 맞춰 왼→오 순서로 0.15 → 1.
 * 줄바꿈(\n)은 <br/>로 유지.
 */
export default function WordReveal({ text, as: Tag = 'p', className, start = 'top 85%', end = 'bottom 55%' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const dim = parseFloat(getComputedStyle(el).getPropertyValue('--word-dim')) || 0.15
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-word]'),
        { opacity: dim },
        { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start, end, scrub: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [text, reduced, start, end])

  const lines = text.split('\n')

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/(\s+)/).map((part, i) =>
            part.trim() === '' ? (
              part
            ) : (
              <span key={i} data-word>
                {part}
              </span>
            ),
          )}
        </Fragment>
      ))}
    </Tag>
  )
}
