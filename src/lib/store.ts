import { useSyncExternalStore } from 'react'

/** 컴포넌트 트리 밖(포털·ScrollTrigger 콜백)에서도 읽고 쓰는 아주 작은 전역 상태 */
export function createStore<T>(initial: T) {
  let value = initial
  const listeners = new Set<() => void>()

  const get = () => value
  const set = (next: T) => {
    if (Object.is(next, value)) return
    value = next
    listeners.forEach((l) => l())
  }
  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
  const useValue = () => useSyncExternalStore(subscribe, get)

  return { get, set, subscribe, useValue }
}
