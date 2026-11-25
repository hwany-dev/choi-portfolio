import { createBrowserRouter } from 'react-router'
import HomePage from './pages/HomePage'
import WorkDetailPage from './pages/WorkDetailPage'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/works/:id', element: <WorkDetailPage /> },
  { path: '*', element: <NotFound /> },
])
