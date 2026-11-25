import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useWorks } from '../../data/queries'
import { buildCategories, formatCategory, normalizeCategory } from '../../data/parse'
import type { Work } from '../../data/types'
import { useSectionRef } from '../../hooks/useActiveSection'
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { gsap, scrollToTarget } from '../../lib/lenis'
import { useLocation } from 'react-router'
import { getNavHeight } from '../../lib/navigation'
import { saveWorksReturn, worksView } from '../../lib/worksReturn'
import BarExpandTransition from '../../components/transitions/BarExpandTransition'
import GridLines from '../../components/GridLines/GridLines'
import WorkCard from './WorkCard'
import styles from './Works.module.css'

const ALL = 'ALL'
const PAGE_SIZE = 12
const FADE_MS = 300
/** 가운데 열 패럴랙스 이동량 (뷰포트 높이 비율) */
const PARALLAX_VH = 0.1
const SKELETON_COUNT = 6
/** 필터 변경 후 필터 줄로 돌아올 때 내비 아래 여백 (px) */
const FILTER_SCROLL_GAP = 40

function useColumnCount() {
  const tablet = useMediaQuery('(max-width: 1024px)')
  const phone = useMediaQuery('(max-width: 480px)')
  return phone ? 1 : tablet ? 2 : 3
}

/** 순서를 유지하며 열에 번갈아 배치 (왼→오, 위→아래 읽힘) */
function toColumns<T>(items: readonly T[], count: number): T[][] {
  const cols: T[][] = Array.from({ length: count }, () => [])
  items.forEach((item, i) => cols[i % count].push(item))
  return cols
}

interface Props {
  /** 상세에서 복귀 시 복원할 필터·개수 */
  initial?: { filter: string; count: number } | null
}

/** WORKS (§4-3, 05~08 캡처) */
export default function Works({ initial }: Props) {
  const { data: works, isPending, isError } = useWorks()
  const reduced = usePrefersReducedMotion()
  const mobile = useMediaQuery('(max-width: 768px)')
  const columnCount = useColumnCount()
  const location = useLocation()

  const [filter, setFilter] = useState(initial?.filter ?? ALL) // 탭 하이라이트 (즉시)
  const [shownFilter, setShownFilter] = useState(initial?.filter ?? ALL) // 그리드에 반영된 필터 (fade 후)
  const [count, setCount] = useState(Math.max(initial?.count ?? PAGE_SIZE, PAGE_SIZE))
  const [fading, setFading] = useState(false)
  const fadeTimer = useRef(0)
  const filtersRef = useRef<HTMLDivElement>(null)
  const masonryRef = useRef<HTMLDivElement>(null)
  const sectionRef = useSectionRef('works')

  useEffect(() => () => window.clearTimeout(fadeTimer.current), [])

  const categories = useMemo(() => (works ? buildCategories(works) : []), [works])
  const filtered = useMemo<Work[]>(
    () => (works ?? []).filter((w) => shownFilter === ALL || normalizeCategory(w.category) === shownFilter),
    [works, shownFilter],
  )
  const visible = filtered.slice(0, count)
  const columns = toColumns(visible, columnCount)

  const selectFilter = useCallback(
    (key: string) => {
      if (key === filter) return
      setFilter(key)
      setFading(true)
      window.clearTimeout(fadeTimer.current)
      fadeTimer.current = window.setTimeout(() => {
        setShownFilter(key)
        setCount(PAGE_SIZE)
        setFading(false)
        // 필터 줄이 화면 위로 지나가 있으면 필터 위치로 돌아온다
        const el = filtersRef.current
        if (el && el.getBoundingClientRect().top < 0) {
          scrollToTarget(el, { offset: -getNavHeight() - FILTER_SCROLL_GAP, immediate: reduced })
        }
      }, FADE_MS)
    },
    [filter, reduced],
  )

  // 열 패럴랙스: 가운데(두 번째) 열만 다른 속도. 모바일·reduced-motion 비활성
  useLayoutEffect(() => {
    const masonry = masonryRef.current
    if (!masonry || reduced || mobile || columnCount < 2) return
    const ctx = gsap.context(() => {
      const target = masonry.querySelector('[data-column="1"]')
      if (!target) return
      const distance = () => window.innerHeight * PARALLAX_VH
      gsap.fromTo(
        target,
        { y: distance },
        {
          y: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: masonry, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        },
      )
    }, masonry)
    return () => ctx.revert()
  }, [reduced, mobile, columnCount, works])

  useEffect(() => {
    const cur = worksView.get()
    if (cur.filter !== shownFilter || cur.count !== count) worksView.set({ filter: shownFilter, count })
  }, [shownFilter, count])

  // 카드 클릭 순간의 위치·필터·개수 저장 → 복귀 시 복원
  const onOpen = useCallback(
    () => saveWorksReturn({ key: location.key, scrollY: window.scrollY, filter: shownFilter, count }),
    [location.key, shownFilter, count],
  )

  const total = works?.length ?? 0

  return (
    <section id="works" ref={sectionRef} data-theme="dark" className={styles.works}>
      <BarExpandTransition lines={['Selected', 'Works']} />

      <div data-anchor className={`grid ${styles.content}`}>
        <GridLines />

        {works && (
          <div ref={filtersRef} className={styles.filters} role="toolbar" aria-label="Category filter">
            {[{ key: ALL, label: 'All', count: total }, ...categories].map((c) => (
              <button
                key={c.key}
                type="button"
                className={styles.filter}
                data-active={filter === c.key}
                aria-pressed={filter === c.key}
                onClick={() => selectFilter(c.key)}
              >
                {c.key === ALL ? c.label : formatCategory(c.label)} ({c.count})
              </button>
            ))}
          </div>
        )}

        {isError && <p className={styles.message}>프로젝트를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</p>}

        <div
          ref={masonryRef}
          className={styles.masonry}
          data-fading={fading}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          aria-busy={isPending}
        >
          {isPending
            ? toColumns(Array.from({ length: SKELETON_COUNT }, (_, i) => i), columnCount).map((col, ci) => (
                <div key={ci} className={styles.column}>
                  {col.map((i) => (
                    <div key={i} className={styles.skeleton} />
                  ))}
                </div>
              ))
            : columns.map((col, ci) => (
                <div key={ci} className={styles.column} data-column={ci}>
                  {col.map((work) => (
                    <WorkCard key={work.id} work={work} column={ci} onOpen={onOpen} />
                  ))}
                </div>
              ))}
        </div>

        {count < filtered.length && (
          <div className={styles.more}>
            <button type="button" className={styles.moreButton} onClick={() => setCount((n) => n + PAGE_SIZE)}>
              Load more
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
