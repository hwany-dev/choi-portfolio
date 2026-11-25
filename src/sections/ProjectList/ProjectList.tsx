import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import { useWorks } from '../../data/queries'
import { formatCategory } from '../../data/parse'
import type { Work } from '../../data/types'
import { useSectionRef } from '../../hooks/useActiveSection'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { ScrollTrigger } from '../../lib/lenis'
import { saveWorksReturn, worksView } from '../../lib/worksReturn'
import GridLines from '../../components/GridLines/GridLines'
import WordReveal from '../../components/WordReveal/WordReveal'
import styles from './ProjectList.module.css'

/** 화면 중앙에서 이 거리(뷰포트 높이 비율)만큼 멀어지면 최소 opacity */
const FOCUS_RANGE = 0.45
const MIN_OPACITY = 0.35

interface YearGroup {
  year: number
  works: Work[]
}

/** 정렬된 works를 연도별로 묶는다 (최신순 유지) */
function groupByYear(works: readonly Work[]): YearGroup[] {
  const groups: YearGroup[] = []
  for (const w of works) {
    const last = groups[groups.length - 1]
    if (last?.year === w.year) last.works.push(w)
    else groups.push({ year: w.year, works: [w] })
  }
  return groups
}

function ThinPlus() {
  return (
    <svg className={styles.plus} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M10 0v20M0 10h20" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** PROJECT LIST (§4-5, 09 캡처): works에서 파생한 텍스트 목록, 연도 그룹, 중앙 강조 */
export default function ProjectList() {
  const { data: works, isPending, isError } = useWorks()
  const reduced = usePrefersReducedMotion()
  const location = useLocation()
  const listRef = useRef<HTMLDivElement>(null)
  const sectionRef = useSectionRef('project-list')

  const groups = useMemo(() => (works ? groupByYear(works) : []), [works])
  const years = works?.map((w) => w.year) ?? []
  const intro = works?.length
    ? `Project List\n${Math.min(...years)} — ${Math.max(...years)}\n${works.length} projects`
    : 'Project List'

  // 화면 세로 중앙에 가까운 행일수록 밝게 (scrub)
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list || reduced || !works) return
    const rows = [...list.querySelectorAll<HTMLElement>('[data-row]')]
    let centers: number[] = []

    const cache = () => {
      centers = rows.map((r) => {
        const b = r.getBoundingClientRect()
        return b.top + window.scrollY + b.height / 2
      })
    }
    const update = () => {
      const mid = window.scrollY + window.innerHeight / 2
      const range = window.innerHeight * FOCUS_RANGE
      rows.forEach((r, i) => {
        const d = Math.min(1, Math.abs(centers[i] - mid) / range)
        r.style.opacity = String(1 - (1 - MIN_OPACITY) * d)
      })
    }

    const trigger = ScrollTrigger.create({
      trigger: list,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: update,
      onRefresh: () => {
        cache()
        update()
      },
    })
    cache()
    update()
    return () => {
      trigger.kill()
      rows.forEach((r) => (r.style.opacity = ''))
    }
  }, [works, reduced])

  // 상세로 가기 직전 위치 저장 → 뒤로가기/Back to Works 시 이 위치로 복귀
  const onOpen = useCallback(
    () => saveWorksReturn({ key: location.key, scrollY: window.scrollY, ...worksView.get() }),
    [location.key],
  )

  return (
    <section id="project-list" ref={sectionRef} className={`grid ${styles.section}`} data-anchor>
      <GridLines />

      <div className={styles.aside}>
        <WordReveal key={intro} text={intro} className={styles.intro} />
      </div>

      <div ref={listRef} className={styles.list}>
        {isPending && <div className={styles.skeleton} />}
        {isError && <p className={styles.message}>프로젝트를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</p>}

        {groups.map((g) => (
          <div key={g.year} className={styles.group}>
            <h3 className={styles.year}>{g.year}</h3>
            <ul>
              {g.works.map((w) => {
                const meta = [formatCategory(w.category), w.client].filter(Boolean).join(' · ')
                return (
                  <li key={w.id} data-row className={styles.row}>
                    <Link to={`/works/${w.id}`} className={styles.link} data-cursor="hover" onClick={onOpen}>
                      <span className={styles.title}>{w.title}</span>
                      <ThinPlus />
                      <span className={styles.meta}>{meta}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
