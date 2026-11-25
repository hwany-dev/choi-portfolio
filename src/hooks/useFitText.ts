import { useLayoutEffect, useState } from 'react'

interface Options {
  /** 글자들이 차지할 폭 비율 (나머지는 글자 사이 간격으로 균등 분배) */
  fill: number
  /** font-size 상한 = 뷰포트 높이 × 이 값 */
  maxViewportHeight: number
  /** 배치가 바뀌면(한 줄 ↔ 여러 줄) 다시 측정하기 위한 키 */
  layout?: string
}

/**
 * 워드마크 font-size 계산. 글자 폭은 font-size에 비례하므로
 * 현재 크기에서 [data-letter] 폭 합을 재서 1px당 폭을 구하고, 목표 폭에 맞춘다.
 * [data-line]으로 여러 줄이면 가장 긴 줄 기준.
 */
export function useFitText(text: string, { fill, maxViewportHeight, layout }: Options) {
  const [el, setEl] = useState<HTMLElement | null>(null)
  const [fontSize, setFontSize] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (!el || !text) return
    let alive = true

    const measure = () => {
      if (!alive) return
      const current = parseFloat(getComputedStyle(el).fontSize)
      const lines = [...el.querySelectorAll<HTMLElement>('[data-line]')]
      const sum = Math.max(
        ...(lines.length ? lines : [el]).map((line) =>
          [...line.querySelectorAll<HTMLElement>('[data-letter]')].reduce((s, l) => s + l.getBoundingClientRect().width, 0),
        ),
      )
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
  }, [el, text, fill, maxViewportHeight, layout])

  return { ref: setEl, el, fontSize }
}
