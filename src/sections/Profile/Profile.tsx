import { useCallback, useLayoutEffect, useRef } from 'react'
import { useSiteSettings } from '../../data/queries'
import { useSectionRef } from '../../hooks/useActiveSection'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { gsap } from '../../lib/lenis'
import { resolveImage } from '../../lib/storage'
import GridLines from '../../components/GridLines/GridLines'
import Img from '../../components/Img/Img'
import SectionLabel from '../../components/SectionLabel/SectionLabel'
import WordReveal from '../../components/WordReveal/WordReveal'
import styles from './Profile.module.css'

/** PROFILE (§4-2, 10 캡처 톤): 흑백 사진 + 이름·직함 + 소개 단어 reveal */
export default function Profile() {
  const { data: settings } = useSiteSettings()
  const reduced = usePrefersReducedMotion()
  const sectionEl = useRef<HTMLElement | null>(null)
  const register = useSectionRef('profile')
  const sectionRef = useCallback(
    (el: HTMLElement | null) => {
      sectionEl.current = el
      return register(el)
    },
    [register],
  )

  const ready = Boolean(settings)

  useLayoutEffect(() => {
    const section = sectionEl.current
    if (!ready || reduced || !section) return
    const ctx = gsap.context(() => {
      // 사진: 아래 → 위 clip reveal + 살짝 줌아웃
      gsap.fromTo(
        '[data-photo]',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-photo]', start: 'top 85%', once: true },
        },
      )
      const img = section.querySelector('[data-photo] img')
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.15 },
          { scale: 1, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: img, start: 'top 85%', once: true } },
        )
      }
      // 이름·직함: 아래에서 올라옴
      gsap.from('[data-meta]', {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-meta]', start: 'top 85%', once: true },
      })
    }, section)
    return () => ctx.revert()
  }, [ready, reduced])

  const name = settings?.profileName
  const photo = resolveImage(settings?.profileImage)

  return (
    <section id="profile" ref={sectionRef} className={`grid ${styles.profile}`}>
      <GridLines />
      <SectionLabel className={styles.label}>Profile</SectionLabel>

      <div className={`col-media ${styles.photoCol}`}>
        {settings && (
          <div data-photo className={styles.photoWrap}>
            <Img src={photo} alt={name ?? 'Profile'} ratio="var(--profile-ratio)" imgClassName={styles.photo} />
          </div>
        )}
      </div>

      <div className={`col-content ${styles.text}`}>
        {(name || settings?.profileRole || settings?.instagramUrl) && (
          <div className={styles.meta}>
            {name && <p data-meta>{name}</p>}
            {settings?.profileRole && (
              <p data-meta className={styles.role}>
                {settings.profileRole}
              </p>
            )}
            {settings?.instagramUrl && (
              <a
                data-meta
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.instagram}
              >
                Instagram ↗
              </a>
            )}
          </div>
        )}
        {settings?.profileBio && <WordReveal text={settings.profileBio} className={styles.bio} />}
      </div>
    </section>
  )
}
