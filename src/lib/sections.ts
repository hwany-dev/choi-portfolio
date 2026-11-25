/** 원페이지 섹션 정의 — 라벨은 하드코딩 허용 항목 (CLAUDE.md §12) */
export const SECTIONS = [
  { id: 'home', label: 'Home', theme: 'light', inNav: true },
  { id: 'profile', label: 'Profile', theme: 'light', inNav: true },
  { id: 'works', label: 'Works', theme: 'dark', inNav: true },
  { id: 'project-list', label: 'Project List', theme: 'dark', inNav: true },
  { id: 'footer', label: 'Footer', theme: 'light', inNav: false },
] as const

export type Section = (typeof SECTIONS)[number]
export type SectionId = Section['id']

export const NAV_SECTIONS = SECTIONS.filter((s) => s.inNav)
export type NavSectionId = (typeof NAV_SECTIONS)[number]['id']

export function isSectionId(value: string): value is SectionId {
  return SECTIONS.some((s) => s.id === value)
}
