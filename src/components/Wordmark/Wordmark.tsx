import { useLayoutEffect, useRef } from 'react'
import { useFitText } from '../../hooks/useFitText'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { gsap, prefersReducedMotion } from '../../lib/lenis'
import styles from './Wordmark.module.css'

const FIT = { fill: 0.82, maxViewportHeight: 0.3 }
const REVEAL = { duration: 0.9, stagger: 0.05, ease: 'power3.out' }
const MOBILE_QUERY = '(max-width: 768px)'

interface Props {
  text: string
  as?: 'h1' | 'p'
  /** 로드 시 글자별 아래→위 stagger reveal (1회) */
  reveal?: boolean
  /** 모바일(≤768)에서 단어마다 줄을 나눔 (EUNJI / CHOI), 각 줄을 좌우 끝까지 분배 */
  stackOnMobile?: boolean
  className?: string
}

function Letter({ char }: { char: string }) {
  return (
    <span className={styles.mask} data-letter aria-hidden="true">
      <span className={styles.letter} data-letter-inner>
        {char}
      </span>
    </span>
  )
}

/**
 * 거대 워드마크 (HOME 상단·푸터). Archivo, 화면 좌우 끝까지 글자 균등 분배.
 * 글자를 span으로 쪼개 space-between, font-size는 useFitText.
 */
export default function Wordmark({ text, as: Tag = 'p', reveal = false, stackOnMobile = false, className }: Props) {
  const mobile = useMediaQuery(MOBILE_QUERY)
  const words = text.trim().toUpperCase().split(/\s+/)
  const stacked = stackOnMobile && mobile && words.length > 1
  const { ref, el, fontSize } = useFitText(text, { ...FIT, layout: stacked ? 'stacked' : 'line' })
  const revealed = useRef(false)
  const chars = [...text.toUpperCase()]

  useLayoutEffect(() => {
    if (!reveal || !el || fontSize === null || revealed.current) return
    revealed.current = true
    if (prefersReducedMotion()) return
    const tween = gsap.fromTo(el.querySelectorAll('[data-letter-inner]'), { yPercent: 110 }, { yPercent: 0, ...REVEAL })
    return () => {
      tween.progress(1)
    }
  }, [reveal, el, fontSize])

  return (
    <Tag
      ref={ref}
      className={`${styles.wordmark} ${stacked ? styles.stacked : ''} ${className ?? ''}`}
      style={{ fontSize: fontSize ?? undefined }}
      data-ready={fontSize !== null}
    >
      <span className="sr-only">{text}</span>
      {stacked
        ? words.map((word, wi) => (
            <span key={wi} className={styles.line} data-line aria-hidden="true">
              {[...word].map((c, i) => (
                <Letter key={i} char={c} />
              ))}
            </span>
          ))
        : chars.map((c, i) =>
            c.trim() === '' ? (
              <span key={i} className={styles.space} data-letter aria-hidden="true" />
            ) : (
              <Letter key={i} char={c} />
            ),
          )}
    </Tag>
  )
}
