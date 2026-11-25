import type { Category, SiteSettings, Work } from './types'

/** 카테고리 정렬 상수 — 목록에 없는 새 값은 뒤에 붙는다 */
export const CATEGORY_ORDER = ['BTL', 'EXHIBITION', 'SPACE', 'POP UP', 'PERFORMANCE', 'COMMUNITY'] as const

/** order 필드가 없을 때 같은 연도 내 맨 뒤로 */
const DEFAULT_ORDER = Number.MAX_SAFE_INTEGER

type Raw = Record<string, unknown>

/** trim + 리터럴 "\n" → 줄바꿈. 빈 문자열/비문자열은 null */
export function cleanText(value: unknown): string | null {
  if (typeof value === 'number') return String(value)
  if (typeof value !== 'string') return null
  const v = value.replace(/\\n/g, '\n').trim()
  return v === '' ? null : v
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function normalizeCategory(value: string): string {
  return value.trim().toUpperCase()
}

export function parseSettings(raw: Raw | undefined): SiteSettings {
  const r = raw ?? {}
  return {
    siteTitle: cleanText(r.siteTitle) ?? '',
    heroTagline: cleanText(r.heroTagline),
    heroCopy: cleanText(r.heroCopy),
    profileName: cleanText(r.profileName),
    profileRole: cleanText(r.profileRole),
    profileBio: cleanText(r.profileBio),
    profileImage: cleanText(r.profileImage),
    instagramUrl: cleanText(r.instagramUrl),
    email: cleanText(r.email),
  }
}

/** 잘못된 문서는 null + console.warn — 문서 하나 때문에 전체가 깨지지 않게 */
export function parseWork(id: string, raw: Raw): Work | null {
  const category = cleanText(raw.category)
  const year = toNumber(raw.year)
  const title = cleanText(raw.title)

  const missing = [!category && 'category', year === null && 'year', !title && 'title'].filter(Boolean)
  if (missing.length > 0 || !category || year === null || !title) {
    console.warn(`[works/${id}] 필수 필드 누락/오류로 건너뜁니다: ${missing.join(', ')}`)
    return null
  }

  return {
    id,
    category,
    year,
    title,
    detailTitle: cleanText(raw.detailTitle),
    client: cleanText(raw.client),
    date: cleanText(raw.date),
    location: cleanText(raw.location),
    details: cleanText(raw.details),
    partners: cleanText(raw.partners),
    workRange: cleanText(raw.workRange),
    order: toNumber(raw.order) ?? DEFAULT_ORDER,
    // 필드 없으면 true. 콘솔에서 문자열 "false"로 넣는 실수도 방어
    published: raw.published !== false && raw.published !== 'false',
  }
}

/** year 내림차순 → order 오름차순 → id */
export function sortWorks(works: readonly Work[]): Work[] {
  return [...works].sort((a, b) => b.year - a.year || a.order - b.order || a.id.localeCompare(b.id))
}

/** 데이터에서 유니크 카테고리 추출 + 개수, CATEGORY_ORDER 순 */
export function buildCategories(works: readonly Work[]): Category[] {
  const map = new Map<string, Category>()
  for (const w of works) {
    const key = normalizeCategory(w.category)
    const entry = map.get(key)
    if (entry) entry.count += 1
    else map.set(key, { key, label: w.category.trim(), count: 1 })
  }
  const rank = (key: string) => {
    const i = (CATEGORY_ORDER as readonly string[]).indexOf(key)
    return i === -1 ? CATEGORY_ORDER.length : i
  }
  return [...map.values()].sort((a, b) => rank(a.key) - rank(b.key) || a.key.localeCompare(b.key))
}
