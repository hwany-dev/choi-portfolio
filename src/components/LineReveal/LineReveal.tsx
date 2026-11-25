import { Fragment, useLayoutEffect, useRef, type ElementType } from 'react'
import { gsap, SplitText } from '../../lib/lenis'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

interface Props {
  text: string
  as?: ElementType
  className?: string
}

/**
 * 큰 타이틀: 줄 단위 마스크 슬라이드업 (y 100% → 0, 0.9s, power3.out), 1회 (§3-9).
 * 실제 줄바꿈 위치 기준(SplitText, 리사이즈·폰트 로드 시 자동 재분할).
 */
export default function LineReveal({ text, as: Tag = 'h1', className }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 100,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        }),
    })
    return () => split.revert()
  }, [text, reduced])

  return (
    <Tag ref={ref} className={className}>
      {text.split('\n').map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </Tag>
  )
}
