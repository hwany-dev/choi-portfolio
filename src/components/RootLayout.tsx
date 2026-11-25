import { useEffect } from 'react'
import { Outlet } from 'react-router'
import FixedLayer from './FixedLayer/FixedLayer'
import { destroyLenis, initLenis } from '../lib/lenis'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

/** 모든 라우트 공통: Lenis 수명주기 + 고정 UI 레이어 */
export default function RootLayout() {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    initLenis()
    return destroyLenis
  }, [reducedMotion])

  return (
    <>
      <Outlet />
      <FixedLayer />
    </>
  )
}
