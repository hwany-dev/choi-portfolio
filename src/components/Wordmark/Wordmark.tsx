import { useLayoutEffect, useRef } from 'react'
import { useFitText } from '../../hooks/useFitText'
import { gsap, prefersReducedMotion } from '../../lib/lenis'
import styles from './Wordmark.module.css'

const FIT = { fill: 0.82, maxViewportHeight: 0.3 }
const REVEAL = { duration: 0.9, stagger: 0.05, ease: 'power3.out' }

interface Props {
  text: string
  as?: 'h1' | 'p'
  /** 로드 시 글자별 아래→위 stagger reveal (1회) */
  reveal?: boolean
  className?: string
}

/**
 * 거대 워드마크 (HOME 상단·푸터). Archivo, 화면 좌우 끝까지 글자 균등 분배.
 * 글자를 span으로 쪼개 space-between, font-size는 useFitText.
 */
export default function Wordmark({ text, as: Tag = 'p', reveal = false, className }: Props) {
  const { ref, el, fontSize } = useFitText(text, FIT)
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
      className={`${styles.wordmark} ${className ?? ''}`}
      style={{ fontSize: fontSize ?? undefined }}
      data-ready={fontSize !== null}
    >
      <span className="sr-only">{text}</span>
      {chars.map((c, i) =>
        c.trim() === '' ? (
          <span key={i} className={styles.space} data-letter aria-hidden="true" />
        ) : (
          /* 아래쪽만 잘라 글자가 아래에서 올라오게 */
          <span key={i} className={styles.mask} data-letter aria-hidden="true">
            <span className={styles.letter} data-letter-inner>
              {c}
            </span>
          </span>
        ),
      )}
    </Tag>
  )
}
