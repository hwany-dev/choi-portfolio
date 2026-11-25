import { createStore } from './store'
import { scrollToTarget } from './lenis'
import type { SectionId } from './sections'

/** 문서 흐름 안의 내비가 화면 상단에 닿았는가 → 고정 내비(FixedLayer) 표시 */
export const navPinned = createStore(false)
/** 모바일 풀스크린 메뉴 */
export const menuOpen = createStore(false)

/** 고정 내비 높이 (Nav가 --nav-h 로 기록) */
export function getNavHeight(): number {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0
}

/**
 * 섹션으로 이동. 섹션 안에 [data-anchor]가 있으면 그 위치로
 * (전환 연출 뒤 실제 콘텐츠 시작점 — WORKS·FOOTER)
 */
export function scrollToSection(id: SectionId, immediate = false) {
  if (id === 'home') {
    scrollToTarget(0, { immediate })
    return
  }
  const section = document.getElementById(id)
  if (!section) return
  // 섹션 상단 여백(--section-pad-top)에 이미 내비 높이가 포함돼 있으므로 오프셋 없이 시작점에 맞춘다
  const target = section.querySelector<HTMLElement>('[data-anchor]') ?? section
  scrollToTarget(target, { immediate })
}
