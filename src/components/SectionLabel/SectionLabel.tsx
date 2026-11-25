import type { ReactNode } from 'react'
import styles from './SectionLabel.module.css'

/** 섹션 좌상단 소문구 라벨 (13px). 기본 col-label 위치 */
export default function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={`col-label ${styles.label} ${className ?? ''}`}>{children}</p>
}
