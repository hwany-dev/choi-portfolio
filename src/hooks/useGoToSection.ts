import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { scrollToSection } from '../lib/navigation'
import type { SectionId } from '../lib/sections'

/** 홈에서는 스무스 스크롤, 다른 페이지(상세)에서는 홈의 해당 섹션으로 이동 */
export function useGoToSection() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return useCallback(
    (id: SectionId) => {
      if (pathname === '/') scrollToSection(id)
      else navigate(id === 'home' ? '/' : `/#${id}`)
    },
    [pathname, navigate],
  )
}
