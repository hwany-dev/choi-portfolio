import { useLayoutEffect, useState } from 'react'

interface Options {
  /** 글자들이 차지할 폭 비율 (나머지는 글자 사이 간격으로 균등 분배) */
  fill: number
  /** font-size 상한 = 뷰포트 높이 × 이 값 */
  maxViewportHeight: number
}

/**
 * 워드마크 font-size 계산. 글자 폭은 font-size에 비례하므로
 * 현재 크기에서 [data-letter] 폭 합을 재서 1px당 폭을 구하고, 목표 폭에 맞춘다.
 */
export function useFitText(text: string, { fill, maxViewportHeight }: Options) {
  const [el, setEl] = useState<HTMLElement | null>(null)
  const [fontSize, setFontSize] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (!el || !text) return
    let alive = true

    const measure = () => {
      if (!alive) return
      const current = parseFloat(getComputedStyle(el).fontSize)
      let sum = 0
      el.querySelectorAll<HTMLElement>('[data-letter]').forEach((l) => {
        sum += l.getBoundingClientRect().width
      })
      if (!sum || !current) return
      const perPx = sum / current
      const size = Math.min((el.clientWidth * fill) / perPx, window.innerHeight * maxViewportHeight)
      setFontSize(Math.round(size * 100) / 100)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    document.fonts.ready.then(measure)
    document.fonts.addEventListener('loadingdone', measure)
    return () => {
      alive = false
      observer.disconnect()
      window.removeEventListener('resize', measure)
      document.fonts.removeEventListener('loadingdone', measure)
    }
  }, [el, text, fill, maxViewportHeight])

  return { ref: setEl, el, fontSize }
}
