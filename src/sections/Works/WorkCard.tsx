import { useCallback, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { useWorkCover } from '../../data/queries'
import type { Work } from '../../data/types'
import { useInView } from '../../hooks/useInView'
import Img from '../../components/Img/Img'
import styles from './Works.module.css'

/** 썸네일 조회를 시작할 거리 (뷰포트 근처) */
const PREFETCH_MARGIN = '600px 0px'
/** 등장 애니메이션 시작 지점 (화면 하단에서 조금 올라온 곳) */
const REVEAL_MARGIN = '0px 0px -8% 0px'

interface Props {
  work: Work
  /** 열 인덱스 — 열마다 약간의 등장 delay */
  column: number
  /** 상세로 이동하기 직전 (복귀 상태 저장) */
  onOpen: () => void
}

/** WORKS 카드: 이미지만, hover 시 하단 캡션 + 이미지 살짝 확대 (§4-3) */
export default function WorkCard({ work, column, onOpen }: Props) {
  const [nearRef, near] = useInView<HTMLAnchorElement>({ rootMargin: PREFETCH_MARGIN })
  const [revealRef, revealed] = useInView<HTMLAnchorElement>({ rootMargin: REVEAL_MARGIN })
  const ref = useCallback(
    (el: HTMLAnchorElement | null) => {
      nearRef(el)
      revealRef(el)
    },
    [nearRef, revealRef],
  )

  const cover = useWorkCover(work.id, near)
  const src = cover.isSuccess ? cover.data : cover.isError ? null : undefined

  return (
    <Link
      ref={ref}
      to={`/works/${work.id}`}
      className={styles.card}
      data-in={revealed}
      data-cursor="hover"
      onClick={onOpen}
      style={{ '--col': column } as CSSProperties}
    >
      <Img src={src} alt={work.title} className={styles.thumb} imgClassName={styles.thumbImg} />
      <span className={styles.caption}>
        {work.year} — {work.title}
      </span>
    </Link>
  )
}
