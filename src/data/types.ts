/** Firestore `settings/site` (빈 문자열 = 없음 → null) */
export interface SiteSettings {
  siteTitle: string
  heroTagline: string | null
  heroCopy: string | null
  profileName: string | null
  profileRole: string | null
  profileBio: string | null
  profileImage: string | null
  instagramUrl: string | null
  email: string | null
}

/** Firestore `works/{id}` */
export interface Work {
  id: string
  category: string
  year: number
  title: string
  detailTitle: string | null
  client: string | null
  date: string | null
  location: string | null
  details: string | null
  partners: string | null
  workRange: string | null
  order: number
  published: boolean
}

export interface Category {
  /** 정규화된 키 (trim + uppercase) */
  key: string
  /** 표시용 원본 값 */
  label: string
  count: number
}
