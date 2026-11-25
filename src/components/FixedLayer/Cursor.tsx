import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/lenis'
import { useFinePointer } from '../../hooks/useMediaQuery'
import styles from './FixedLayer.module.css'

const LERP = 0.18
/** 이 요소 위에서 dot 확대. 카드 등은 data-cursor="hover" 를 붙인다 */
const HOVER_SELECTOR = 'a, button, [role="button"], [data-cursor="hover"]'

/** 커스텀 커서 — 네이티브 커서는 유지 (접근성), (pointer: fine)에서만 */
export default function Cursor() {
  const fine = useFinePointer()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!fine || !el) return

    const lerp = prefersReducedMotion() ? 1 : LERP
    const pos = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    let visible = false

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        pos.x = target.x
        pos.y = target.y
        visible = true
        el.dataset.visible = 'true'
      }
    }
    const onOver = (e: PointerEvent) => {
      const hit = e.target instanceof Element && e.target.closest(HOVER_SELECTOR)
      el.dataset.hover = String(Boolean(hit))
    }
    const onLeave = () => {
      visible = false
      el.dataset.visible = 'false'
    }
    const tick = () => {
      pos.x += (target.x - pos.x) * lerp
      pos.y += (target.y - pos.y) * lerp
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    gsap.ticker.add(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      gsap.ticker.remove(tick)
    }
  }, [fine])

  if (!fine) return null
  return (
    <div ref={ref} className={styles.cursor} aria-hidden="true">
      <div className={styles.cursorDot} />
    </div>
  )
}
