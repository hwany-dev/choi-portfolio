import styles from './GridLines.module.css'

/**
 * 배경 컬럼 헤어라인 (+ HOME 대각선). 부모는 position:relative + isolation:isolate.
 * 색은 부모 테마의 --line.
 */
export default function GridLines({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <div className={`${styles.lines} grid-lines`} aria-hidden="true">
      {diagonal && (
        <svg className={styles.diagonal} viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  )
}
