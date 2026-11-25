import { useEffect } from 'react'
import { Outlet } from 'react-router'
import FixedLayer from './FixedLayer/FixedLayer'
import { destroyLenis, initLenis, ScrollTrigger } from '../lib/lenis'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

const REFRESH_DEBOUNCE_MS = 150

/** 모든 라우트 공통: Lenis 수명주기 + 고정 UI 레이어 + ScrollTrigger 자동 refresh */
export default function RootLayout() {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    initLenis()
    return destroyLenis
  }, [reducedMotion])

  // 데이터·이미지 로드로 문서 높이가 바뀌면 트리거 위치 재계산 (masonry 대응)
  useEffect(() => {
    let timer = 0
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), REFRESH_DEBOUNCE_MS)
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <Outlet />
      <FixedLayer />
    </>
  )
}
