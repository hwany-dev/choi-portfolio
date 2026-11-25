/** 원페이지 섹션 정의 — 라벨은 하드코딩 허용 항목 (CLAUDE.md §12) */
export const SECTIONS = [
  { id: 'home', label: 'Home', theme: 'light', inNav: true },
  { id: 'profile', label: 'Profile', theme: 'light', inNav: true },
  { id: 'works', label: 'Works', theme: 'dark', inNav: true },
  { id: 'project-list', label: 'Project List', theme: 'dark', inNav: true },
  { id: 'contact', label: 'Contact', theme: 'light', inNav: false },
] as const

export type Section = (typeof SECTIONS)[number]
export type SectionId = Section['id']

export const NAV_SECTIONS = SECTIONS.filter((s) => s.inNav)
