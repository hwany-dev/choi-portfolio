import { list, listAll, ref, type StorageReference } from 'firebase/storage'
import { storage, storageBucket } from './firebase'

const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'])

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })

/** 파일명 natural sort (01, 2, 10 …) */
export function naturalSort<T>(items: readonly T[], key: (item: T) => string): T[] {
  return [...items].sort((a, b) => collator.compare(key(a), key(b)))
}

/** public read 규칙이므로 getDownloadURL 대신 직접 URL 생성 */
export function storageUrl(fullPath: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(fullPath)}?alt=media`
}

/** http(s)로 시작하면 그대로, 아니면 Storage 경로로 간주. 빈 값은 null */
export function resolveImage(value: string | null | undefined): string | null {
  const v = value?.trim()
  if (!v) return null
  if (/^https?:\/\//i.test(v)) return v
  return storageUrl(v.replace(/^\/+/, ''))
}

function isAllowedImage(item: StorageReference): boolean {
  const ext = item.name.split('.').pop()?.toLowerCase() ?? ''
  if (ALLOWED_EXT.has(ext)) return true
  console.warn(`[storage] 지원하지 않는 파일 형식이라 무시합니다: ${item.fullPath}`)
  return false
}

function toUrls(items: StorageReference[]): string[] {
  return naturalSort(items.filter(isAllowedImage), (i) => i.name).map((i) => storageUrl(i.fullPath))
}

export interface WorkImages {
  cover: string | null
  details: string[]
}

/** 상세: 폴더 전체 → natural sort → [cover, ...details] */
export async function listWorkImages(id: string): Promise<WorkImages> {
  const res = await listAll(ref(storage, `works/${id}`))
  const [cover = null, ...details] = toUrls(res.items)
  return { cover, details }
}

/** 썸네일: 첫 파일 1개만 조회. 첫 파일이 이미지가 아니면 전체 조회로 폴백 */
export async function getCover(id: string): Promise<string | null> {
  const res = await list(ref(storage, `works/${id}`), { maxResults: 1 })
  const first = res.items[0]
  if (!first) return null
  if (isAllowedImage(first) && !res.nextPageToken) return storageUrl(first.fullPath)
  // 파일이 여러 개면 서버 정렬(사전순)과 natural sort가 다를 수 있으므로 전체 조회
  return (await listWorkImages(id)).cover
}
