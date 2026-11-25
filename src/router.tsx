import { createBrowserRouter } from 'react-router'
import RootLayout from './components/RootLayout'
import HomePage from './pages/HomePage'
import WorkDetailPage from './pages/WorkDetailPage'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/works/:id', element: <WorkDetailPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
