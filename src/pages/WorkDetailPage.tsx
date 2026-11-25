import { useParams } from 'react-router'

/** 임시: 7단계에서 구현 */
export default function WorkDetailPage() {
  const { id } = useParams()
  return (
    <main data-theme="light" className="grid" style={{ minHeight: '100svh' }}>
      <p className="col-label">{id}</p>
    </main>
  )
}
