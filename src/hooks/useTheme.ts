import { useCallback, useSyncExternalStore } from 'react'

/** index.html 인라인 스크립트와 동일하게 유지 */
const STORAGE_KEY = 'invert-color'
const THEME_COLOR = { normal: '#f0f0f0', inverted: '#0e0e0e' } as const
const ATTR = 'data-inverted'

const root = document.documentElement

function read(): boolean {
  return root.hasAttribute(ATTR)
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(root, { attributes: true, attributeFilter: [ATTR] })
  return () => observer.disconnect()
}

function apply(inverted: boolean) {
  root.toggleAttribute(ATTR, inverted)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', inverted ? THEME_COLOR.inverted : THEME_COLOR.normal)
  try {
    localStorage.setItem(STORAGE_KEY, inverted ? '1' : '0')
  } catch {
    /* private mode 등 — 저장 실패해도 동작은 유지 */
  }
}

/** INVERT COLOR 상태. 초기값은 index.html 인라인 스크립트가 세팅한다 (FOUC 방지) */
export function useTheme() {
  const inverted = useSyncExternalStore(subscribe, read)
  const toggle = useCallback(() => apply(!read()), [])
  return { inverted, toggle, setInverted: apply }
}
