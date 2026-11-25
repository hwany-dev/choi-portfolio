// global.css를 가장 먼저 — 컴포넌트 CSS Module이 유틸(.col-*)을 덮어쓸 수 있게
import './styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

// 스크롤 위치는 앱이 직접 관리 (상세 진입 시 맨 위, 홈 복귀 시 WORKS 위치 복원)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
