/**
 * 상세 → 홈 복귀 시 WORKS 상태 복원 (§4-4).
 * 카드 클릭 순간 저장하고, 홈이 "복귀"로 열릴 때 읽은 뒤 지운다.
 * key = 저장 당시 홈 히스토리 항목의 location.key → 브라우저 뒤로가기 판별용.
 */
const STORAGE_KEY = 'works-return'

export interface WorksReturn {
  key: string
  scrollY: number
  filter: string
  count: number
}

function isWorksReturn(v: unknown): v is WorksReturn {
  if (!v || typeof v !== 'object') return false
  const r = v as Record<string, unknown>
  return (
    typeof r.key === 'string' && typeof r.scrollY === 'number' && typeof r.filter === 'string' && typeof r.count === 'number'
  )
}

export function saveWorksReturn(value: WorksReturn) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* 저장 실패해도 동작은 유지 */
  }
}

export function readWorksReturn(): WorksReturn | null {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null')
    return isWorksReturn(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function clearWorksReturn() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* noop */
  }
}

/** Link state 로 "복귀"를 알리는 표시 */
export interface ReturnState {
  restoreWorks?: boolean
}
