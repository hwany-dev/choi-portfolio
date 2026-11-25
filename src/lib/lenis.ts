import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** 앵커 이동 duration (초) */
export const SCROLL_DURATION = 1.2

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

let lenis: Lenis | null = null
let tick: ((time: number) => void) | null = null
let offScroll: (() => void) | null = null

export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

/** Lenis 싱글톤 + GSAP ticker 연동. reduced-motion이면 만들지 않는다 (네이티브 스크롤) */
export function initLenis(): Lenis | null {
  if (lenis || prefersReducedMotion()) return lenis

  lenis = new Lenis({ autoRaf: false })
  offScroll = lenis.on('scroll', ScrollTrigger.update)
  tick = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function destroyLenis() {
  if (tick) gsap.ticker.remove(tick)
  offScroll?.()
  lenis?.destroy()
  lenis = null
  tick = null
  offScroll = null
}

export function getLenis(): Lenis | null {
  return lenis
}

interface ScrollOptions {
  offset?: number
  immediate?: boolean
}

/** Lenis가 있으면 스무스, 없으면(reduced-motion) 즉시 이동 */
export function scrollToTarget(target: string | number | HTMLElement, { offset = 0, immediate = false }: ScrollOptions = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, duration: SCROLL_DURATION })
    return
  }
  let top: number
  if (typeof target === 'number') top = target
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return
    top = el.getBoundingClientRect().top + window.scrollY
  }
  window.scrollTo({ top: top + offset, behavior: 'auto' })
}

export function stopScroll() {
  lenis?.stop()
}

export function startScroll() {
  lenis?.start()
}

export { gsap, ScrollTrigger }
