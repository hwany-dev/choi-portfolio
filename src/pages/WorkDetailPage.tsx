import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useSiteSettings, useWorkImages, useWorks } from '../data/queries'
import type { Work } from '../data/types'
import { useInView } from '../hooks/useInView'
import { usePageTheme } from '../hooks/usePageTheme'
import { scrollToTarget } from '../lib/lenis'
import { navPinned } from '../lib/navigation'
import { readWorksReturn, type ReturnState } from '../lib/worksReturn'
import Img from '../components/Img/Img'
import { ratioCache } from '../components/Img/ratioCache'
import LineReveal from '../components/LineReveal/LineReveal'
import styles from './WorkDetailPage.module.css'

/** index.html 기본 title (상세에서 나갈 때 복원) */
const DEFAULT_TITLE = document.title

/** 메타 행 — 순서 고정, 라벨은 하드코딩 허용 항목. 값이 빈 행은 숨김 */
const META_FIELDS: { label: string; key: keyof Work }[] = [
  { label: 'Client', key: 'client' },
  { label: 'Date', key: 'date' },
  { label: 'Location', key: 'location' },
  { label: 'Details', key: 'details' },
  { label: 'Partners', key: 'partners' },
  { label: 'Work Range', key: 'workRange' },
]

/** 연속된 가로 이미지 2장만 2열로 묶는다 (나머지는 한 줄 전체) */
function pairLandscapes(srcs: string[], ratios: Record<string, number>): Set<string> {
  const paired = new Set<string>()
  for (let i = 0; i < srcs.length - 1; i++) {
    const a = ratios[srcs[i]]
    const b = ratios[srcs[i + 1]]
    if (a > 1 && b > 1) {
      paired.add(srcs[i])
      paired.add(srcs[i + 1])
      i++
    }
  }
  return paired
}

function DetailImage({ src, alt, paired, onRatio }: { src: string; alt: string; paired: boolean; onRatio: (r: number) => void }) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -8% 0px' })
  return (
    <div ref={ref} className={styles.image} data-paired={paired} data-in={inView}>
      <Img src={src} alt={alt} onLoad={onRatio} />
    </div>
  )
}

/** /works/:id — urbanplay 상세 구조 + santalarch 스타일 (§4-4) */
export default function WorkDetailPage() {
  const { id } = useParams()
  const works = useWorks()
  const images = useWorkImages(id)
  const { data: settings } = useSiteSettings()

  const list = works.data ?? []
  const index = list.findIndex((w) => w.id === id)
  const work = index >= 0 ? list[index] : undefined
  const prev = index > 0 ? list[index - 1] : null
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null

  // 진입·작품 전환 시 맨 위로
  useLayoutEffect(() => {
    scrollToTarget(0, { immediate: true })
  }, [id])

  usePageTheme('light')

  // 상세엔 문서 흐름 내비가 없으므로 고정 내비를 처음부터 표시
  useEffect(() => {
    navPinned.set(true)
    return () => navPinned.set(false)
  }, [])

  useEffect(() => {
    if (work) document.title = settings?.siteTitle ? `${work.title} — ${settings.siteTitle}` : work.title
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [work, settings?.siteTitle])

  // 상세 이미지 비율 (가로 2장 묶기 판단용)
  const [ratios, setRatios] = useState<Record<string, number>>({})
  const setRatio = useCallback((src: string, r: number) => setRatios((prev) => (prev[src] === r ? prev : { ...prev, [src]: r })), [])

  const backTo = readWorksReturn() ? '/' : '/#works'
  const backState: ReturnState = { restoreWorks: true }

  if (works.isError) {
    return (
      <main className={`grid ${styles.state}`}>
        <p className="col-content">프로젝트를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</p>
      </main>
    )
  }

  if (!works.isPending && !work) {
    return (
      <main className={`grid ${styles.state}`}>
        <div className="col-content">
          <h1 className={styles.notFound}>Project not found</h1>
          <Link to="/#works" className={styles.link}>
            Back to Works
          </Link>
        </div>
      </main>
    )
  }

  const title = work ? (work.detailTitle ?? work.title) : ''
  const cover = images.isSuccess ? images.data.cover : images.isError ? null : undefined
  const details = images.data?.details ?? []
  const known = Object.fromEntries(details.map((s) => [s, ratios[s] ?? ratioCache.get(s) ?? 0]))
  const paired = pairLandscapes(details, known)

  return (
    <main className={styles.page}>
      {/* 1. 메인 이미지 */}
      <Img
        src={work ? cover : undefined}
        alt={work?.title ?? ''}
        priority
        className={styles.cover}
        imgClassName={styles.coverImg}
      />

      <div className={`grid ${styles.body}`}>
        {/* 2. 타이틀 */}
        {work ? (
          <LineReveal key={work.id} text={title} className={styles.title} />
        ) : (
          <div className={styles.titleSkeleton} />
        )}

        {/* 3. 메타 */}
        {work && (
          <dl className={styles.meta}>
            {META_FIELDS.map(({ label, key }) => {
              const value = work[key]
              if (typeof value !== 'string' || !value) return null
              return (
                <div key={key} className={styles.metaRow}>
                  <dt className={styles.metaLabel}>{label}</dt>
                  <dd className={styles.metaValue}>{value}</dd>
                </div>
              )
            })}
          </dl>
        )}

        {/* 4. 상세 이미지 — 개수 제한 없음 */}
        {work && details.length > 0 && (
          <div className={styles.images}>
            {details.map((src) => (
              <DetailImage key={src} src={src} alt={work.title} paired={paired.has(src)} onRatio={(r) => setRatio(src, r)} />
            ))}
          </div>
        )}

        {/* 5. Prev / Back / Next (전체 정렬 기준) */}
        {work && (
          <nav className={styles.pager} aria-label="Project navigation">
            <div className={styles.prev}>
              {prev && (
                <Link to={`/works/${prev.id}`} className={styles.pagerLink}>
                  <span className={styles.pagerLabel}>← Prev</span>
                  <span className={styles.pagerTitle}>{prev.title}</span>
                </Link>
              )}
            </div>
            <div className={styles.back}>
              <Link to={backTo} state={backState} className={styles.pagerLink}>
                <span className={styles.pagerLabel}>Back to Works</span>
              </Link>
            </div>
            <div className={styles.next}>
              {next && (
                <Link to={`/works/${next.id}`} className={styles.pagerLink}>
                  <span className={styles.pagerLabel}>Next →</span>
                  <span className={styles.pagerTitle}>{next.title}</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </main>
  )
}
