import { useEffect, type RefObject } from 'react'
import { ScrollTrigger } from '../../lib/lenis'
import { NAV_SECTIONS, SECTIONS } from '../../lib/sections'

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/**
 * 스크롤 진행 라인 (§3-6).
 * 섹션 k의 시작에서 탭 k의 tick에 닿고, 섹션 k를 지나는 동안 다음 tick까지 늘어난다.
 * 마지막 탭 섹션 동안은 내비 오른쪽 끝까지, 그 뒤(CONTACT)는 꽉 찬 상태.
 * 모든 [data-nav-progress] 요소(문서 내 내비 + 고정 내비)에 같은 값을 쓴다.
 * 고정 내비 한 곳에서만 실행하고, --nav-h 도 여기서 기록한다.
 */
export function useNavProgress(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const nav = ref.current
    if (!enabled || !nav) return

    let width = 1
    let navH = 0
    let stops: number[] = []
    let tops: number[] = []

    const cache = () => {
      width = nav.clientWidth || 1
      navH = nav.offsetHeight
      document.documentElement.style.setProperty('--nav-h', `${navH}px`)
      const ticks = [...nav.querySelectorAll<HTMLElement>('[data-nav-tick]')].map((t) => t.offsetLeft)
      stops = [...ticks.slice(0, NAV_SECTIONS.length), width]
      tops = SECTIONS.map((s) => {
        const el = document.getElementById(s.id)
        return el ? el.getBoundingClientRect().top + window.scrollY : Number.NaN
      })
    }

    const update = () => {
      let x = 0
      if (tops.length && tops.every(Number.isFinite)) {
        const y = window.scrollY + navH
        let k = 0
        while (k < tops.length - 1 && y >= tops[k + 1]) k++
        if (k >= NAV_SECTIONS.length) x = width
        else x = stops[k] + (stops[k + 1] - stops[k]) * clamp01((y - tops[k]) / (tops[k + 1] - tops[k]))
      }
      const transform = `scaleX(${x / width})`
      document.querySelectorAll<HTMLElement>('[data-nav-progress]').forEach((el) => {
        el.style.transform = transform
      })
    }

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: update,
      onRefresh: () => {
        cache()
        update()
      },
    })
    cache()
    update()
    return () => trigger.kill()
  }, [ref, enabled])
}
