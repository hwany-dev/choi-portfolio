import { useTheme } from '../../hooks/useTheme'
import styles from './FixedLayer.module.css'

/** 좌하단 `invert color` — santalarch처럼 i 의 점 대신 원형 dot */
export default function InvertToggle() {
  const { inverted, toggle } = useTheme()
  return (
    <button type="button" className={styles.invert} onClick={toggle} aria-pressed={inverted} aria-label="Invert color">
      <span aria-hidden="true" className={styles.invertI}>
        <span className={styles.invertDot} />ı
      </span>
      <span aria-hidden="true">nvert color</span>
    </button>
  )
}
