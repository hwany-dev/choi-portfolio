import { useLayoutEffect, useState } from 'react'

interface Options {
  /** 글자들이 차지할 폭 비율 (나머지는 글자 사이 간격으로 균등 분배) */
  fill: number
  /** font-size 상한 = 뷰포트 높이 × 이 값 */
  maxViewportHeight: number
  /** 배치가 바뀌면(한 줄 ↔ 여러 줄) 다시 측정하기 위한 키 */
  layout?: string
}

/** 이보다 작은 변화는 무시 (렌더링 반올림 때문에 값이 왔다 갔다 하는 것 방지) */
const MIN_CHANGE_PX = 1

/**
 * 뷰포트 높이 (100svh). iOS Safari는 스크롤로 주소창이 접히면 innerHeight가 바뀌어
 * 워드마크 크기가 출렁이므로, 주소창과 무관한 svh 값을 숨김 probe로 잰다.
 */
let probe: HTMLDivElement | null = null
function viewportHeight() {
  if (!probe) {
    probe = document.createElement('div')
    probe.setAttribute('aria-hidden', 'true')
    probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none'
    document.body.appendChild(probe)
  }
  return probe.offsetHeight || window.innerHeight
}

/**
 * 워드마크 font-size 계산. 글자 폭은 font-size에 비례하므로
 * 현재 크기에서 [data-letter] 폭 합을 재서 1px당 폭을 구하고, 목표 폭에 맞춘다.
 * [data-line]으로 여러 줄이면 가장 긴 줄 기준.
 *
 * 다시 재는 시점은 폭이 바뀔 때·폰트 로드 때뿐이다. 높이 변화(자기 font-size 변경,
 * 모바일 주소창)로는 다시 재지 않아 크기가 출렁이지 않는다.
 */
export function useFitText(text: string, { fill, maxViewportHeight, layout }: Options) {
  const [el, setEl] = useState<HTMLElement | null>(null)
  const [fontSize, setFontSize] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (!el || !text) return
    let alive = true
    let lastWidth = -1
    let applied: number | null = null
    let fontsReady = false

    const measure = () => {
      if (!alive || !fontsReady) return
      const current = parseFloat(getComputedStyle(el).fontSize)
      const lines = [...el.querySelectorAll<HTMLElement>('[data-line]')]
      const sum = Math.max(
        ...(lines.length ? lines : [el]).map((line) =>
          [...line.querySelectorAll<HTMLElement>('[data-letter]')].reduce((s, l) => s + l.getBoundingClientRect().width, 0),
        ),
      )
      if (!sum || !current) return
      lastWidth = el.clientWidth
      const perPx = sum / current
      const size = Math.round(Math.min((lastWidth * fill) / perPx, viewportHeight() * maxViewportHeight) * 100) / 100
      if (applied !== null && Math.abs(size - applied) < MIN_CHANGE_PX) return
      applied = size
      setFontSize(size)
    }

    const onResize = () => {
      if (el.clientWidth !== lastWidth) measure()
    }

    // 폰트가 준비되기 전 대체 폰트로 잰 크기를 보여주지 않도록, 폰트 로드 후 첫 측정
    const cs = getComputedStyle(el)
    document.fonts
      .load(`${cs.fontWeight} 16px ${cs.fontFamily}`, text)
      .catch(() => undefined)
      .then(() => document.fonts.ready)
      .then(() => {
        fontsReady = true
        applied = null
        measure()
      })

    const onFontsLoaded = () => {
      applied = null
      measure()
    }
    const observer = new ResizeObserver(onResize)
    observer.observe(el)
    window.addEventListener('resize', onResize)
    document.fonts.addEventListener('loadingdone', onFontsLoaded)
    return () => {
      alive = false
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      document.fonts.removeEventListener('loadingdone', onFontsLoaded)
    }
  }, [el, text, fill, maxViewportHeight, layout])

  return { ref: setEl, el, fontSize }
}
