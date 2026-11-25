import { useEffect, useState } from 'react'

interface Options {
  rootMargin?: string
  threshold?: number
  /** true면 한 번 들어온 뒤 관찰 중지 */
  once?: boolean
}

/** IntersectionObserver. [callbackRef, inView] */
export function useInView<T extends Element>({ rootMargin = '0px', threshold = 0, once = true }: Options = {}) {
  const [el, setEl] = useState<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!el || (once && inView)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) setInView(false)
      },
      { rootMargin, threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [el, rootMargin, threshold, once, inView])

  return [setEl, inView] as const
}
