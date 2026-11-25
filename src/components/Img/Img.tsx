import { useState, type CSSProperties } from 'react'
import styles from './Img.module.css'

interface Props {
  /** undefined = 아직 URL 조회 중(빈 skeleton) / null = 이미지 없음(대체 텍스트) */
  src: string | null | undefined
  alt: string
  /** CSS aspect-ratio. 생략하면 로드 전엔 --img-fallback-ratio, 로드 후엔 원본 비율 */
  ratio?: string
  /** true면 lazy 대신 즉시 + fetchpriority high (상세 메인 이미지 전용) */
  priority?: boolean
  className?: string
  imgClassName?: string
  onLoad?: () => void
}

/**
 * 이미지 + 비율 유지 skeleton. src가 없거나 로드 실패 시 테마 dim 배경 + alt 텍스트.
 */
export default function Img({ src, alt, ratio, priority = false, className, imgClassName, onLoad }: Props) {
  const [state, setState] = useState<{ src: typeof src; status: 'loading' | 'loaded' | 'error'; natural?: string }>({
    src,
    status: 'loading',
  })
  // src가 바뀌면 상태 리셋 (렌더 중 동기화)
  if (state.src !== src) setState({ src, status: 'loading' })

  const pending = src === undefined
  const failed = src === null || src === '' || state.status === 'error'
  const style: CSSProperties = { aspectRatio: ratio ?? state.natural ?? 'var(--img-fallback-ratio)' }

  return (
    <div
      className={`${styles.frame} ${className ?? ''}`}
      style={style}
      data-status={pending ? 'loading' : failed ? 'error' : state.status}
    >
      {pending ? null : failed ? (
        <span className={styles.fallback}>{alt}</span>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${styles.img} ${imgClassName ?? ''}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={(e) => {
            const { naturalWidth: w, naturalHeight: h } = e.currentTarget
            setState({ src, status: 'loaded', natural: w && h ? `${w} / ${h}` : undefined })
            onLoad?.()
          }}
          onError={() => setState({ src, status: 'error' })}
        />
      )}
    </div>
  )
}
