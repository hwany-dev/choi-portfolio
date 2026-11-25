import { useActiveSection } from '../../hooks/useActiveSection'
import { NAV_SECTIONS } from '../../lib/sections'
import styles from './FixedLayer.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

/** 우하단 `{섹션명}  {현재} | {전체}` — 탭 섹션 밖(FOOTER, 상세 페이지)에서는 숨김 */
export default function SectionIndicator() {
  const active = useActiveSection()
  const index = NAV_SECTIONS.findIndex((s) => s.id === active)
  const section = NAV_SECTIONS[index]

  return (
    <div className={styles.indicator} data-hidden={!section} aria-hidden="true">
      {section && (
        <>
          <span>{section.label}</span>
          <span className={styles.count}>
            <span>{pad(index + 1)}</span>
            <span className={styles.sep} />
            <span>{pad(NAV_SECTIONS.length)}</span>
          </span>
        </>
      )}
    </div>
  )
}
