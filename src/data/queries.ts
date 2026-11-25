import { useQuery } from '@tanstack/react-query'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import { getCover, listWorkImages } from '../lib/storage'
import { parseSettings, parseWork, sortWorks } from './parse'
import type { Work } from './types'

/** Storage 목록은 거의 안 바뀌므로 길게 캐시 */
const STORAGE_STALE_TIME = 30 * 60 * 1000

function assertConfigured() {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured')
}

export const queryKeys = {
  settings: ['settings', 'site'] as const,
  works: ['works'] as const,
  cover: (id: string) => ['works', id, 'cover'] as const,
  images: (id: string) => ['works', id, 'images'] as const,
}

export function useSiteSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: async () => {
      assertConfigured()
      const snap = await getDoc(doc(db, 'settings', 'site'))
      return parseSettings(snap.data())
    },
  })
}

/** 공개된 작품만, 정렬 완료 상태로 반환 */
export function useWorks() {
  return useQuery({
    queryKey: queryKeys.works,
    queryFn: async (): Promise<Work[]> => {
      assertConfigured()
      const snap = await getDocs(collection(db, 'works'))
      const works = snap.docs
        .map((d) => parseWork(d.id, d.data()))
        .filter((w): w is Work => w !== null && w.published)
      return sortWorks(works)
    },
  })
}

/** 썸네일 — 카드가 뷰포트 근처에 올 때 enabled=true 로 호출 */
export function useWorkCover(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.cover(id),
    queryFn: () => getCover(id),
    enabled: enabled && isFirebaseConfigured,
    staleTime: STORAGE_STALE_TIME,
  })
}

export function useWorkImages(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.images(id ?? ''),
    queryFn: () => listWorkImages(id ?? ''),
    enabled: Boolean(id) && isFirebaseConfigured,
    staleTime: STORAGE_STALE_TIME,
  })
}
