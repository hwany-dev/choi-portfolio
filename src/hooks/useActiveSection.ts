import { useCallback, useSyncExternalStore } from 'react'
import type { SectionId } from '../lib/sections'

/**
 * 화면 세로 중앙선을 지나는 섹션 = 현재 섹션.
 * 섹션은 useSectionRef(id)로 등록하고, Nav·인디케이터는 useActiveSection()으로 구독한다.
 * IntersectionObserver 하나를 모든 구독자가 공유한다.
 */
const listeners = new Set<() => void>()
const ids = new Map<Element, SectionId>()
const intersecting = new Set<SectionId>()
let active: SectionId | null = null
let observer: IntersectionObserver | null = null

function setActive(next: SectionId | null) {
  if (next === active) return
  active = next
  listeners.forEach((l) => l())
}

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      let latest: SectionId | null = null
      for (const entry of entries) {
        const id = ids.get(entry.target)
        if (!id) continue
        if (entry.isIntersecting) {
          intersecting.add(id)
          latest = id
        } else intersecting.delete(id)
      }
      // 새로 들어온 섹션 우선, 없으면 남아 있는 섹션, 그것도 없으면 직전 값 유지
      setActive(latest ?? (intersecting.has(active as SectionId) ? active : ([...intersecting][0] ?? active)))
    },
    { rootMargin: '-50% 0px -50% 0px' },
  )
  return observer
}

function register(el: Element, id: SectionId) {
  ids.set(el, id)
  getObserver().observe(el)
  return () => {
    observer?.unobserve(el)
    ids.delete(el)
    intersecting.delete(id)
    if (![...ids.values()].includes(id) && active === id) setActive(null)
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useActiveSection(): SectionId | null {
  return useSyncExternalStore(subscribe, () => active)
}

/** 섹션 루트 요소에 ref로 연결 */
export function useSectionRef(id: SectionId) {
  return useCallback((el: HTMLElement | null) => (el ? register(el, id) : undefined), [id])
}
