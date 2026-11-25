import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useActiveSection } from './useActiveSection'
import { scrollToTarget, ScrollTrigger } from '../lib/lenis'
import { scrollToSection } from '../lib/navigation'
import { isSectionId, type SectionId } from '../lib/sections'
import { clearWorksReturn, readWorksReturn, type ReturnState, type WorksReturn } from '../lib/worksReturn'

type Plan =
  | { type: 'section'; id: SectionId }
  | { type: 'return'; saved: WorksReturn }
  | { type: 'top' }

/**
 * 홈 진입 시 스크롤 위치 결정 + 스크롤 중 hash 갱신.
 * 1) 상세에서 복귀(Back to Works 또는 브라우저 뒤로)면 저장된 위치·필터·개수로
 * 2) #hash 가 섹션이면 그 섹션으로
 * 3) 그 외엔 맨 위
 * 반환값의 restored 는 Works 초기 필터/개수에 쓴다.
 */
export function useScrollRestore(ready: boolean) {
  const location = useLocation()
  const [plan] = useState<Plan>(() => {
    // 복귀가 hash보다 우선 — 뒤로가기한 홈 항목의 URL엔 스크롤 중 갱신된 #works 가 남아 있다
    const saved = readWorksReturn()
    const state = location.state as ReturnState | null
    if (saved && (state?.restoreWorks || saved.key === location.key)) return { type: 'return', saved }
    const hash = location.hash.slice(1)
    if (isSectionId(hash)) return { type: 'section', id: hash }
    return { type: 'top' }
  })
  const [done, setDone] = useState(plan.type === 'top')
  const active = useActiveSection()

  // 맨 위: 이전 페이지 스크롤 위치가 남지 않게 즉시
  useEffect(() => {
    if (plan.type === 'top') scrollToTarget(0, { immediate: true })
  }, [plan])

  useEffect(() => {
    if (done || !ready) return
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (plan.type === 'section') scrollToSection(plan.id, true)
      else if (plan.type === 'return') {
        scrollToTarget(plan.saved.scrollY, { immediate: true })
        clearWorksReturn()
      }
      setDone(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [ready, done, plan])

  useEffect(() => {
    if (!done || !active) return
    const { pathname, search } = window.location
    history.replaceState(history.state, '', active === 'home' ? pathname + search : `#${active}`)
  }, [active, done])

  return { restored: plan.type === 'return' ? plan.saved : null }
}
