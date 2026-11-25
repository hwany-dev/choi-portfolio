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
  const target = section.querySelector<HTMLElement>('[data-anchor]') ?? section
  scrollToTarget(target, { offset: -getNavHeight(), immediate })
}
