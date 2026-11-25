import { useEffect } from 'react'

export type Theme = 'light' | 'dark'

/**
 * 페이지 전체 테마(html[data-theme]). 값이 바뀌면 배경·글자색이 --dur-theme 동안 부드럽게 전환된다.
 * 홈에서는 현재 섹션의 테마를, 다른 페이지에서는 고정 값을 넘긴다.
 */
export function usePageTheme(theme: Theme) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
}
