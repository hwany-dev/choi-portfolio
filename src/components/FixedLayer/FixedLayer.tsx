import { createPortal } from 'react-dom'
import Cursor from './Cursor'
import InvertToggle from './InvertToggle'
import SectionIndicator from './SectionIndicator'

/**
 * body 직속 portal. Fragment라 래퍼 요소 없이 각 요소가 body의 자식이 된다
 * → mix-blend-mode: difference 가 페이지 전체와 섞인다.
 * (Nav의 sticky 이후 고정 상태는 4단계에서 추가)
 */
export default function FixedLayer() {
  return createPortal(
    <>
      <InvertToggle />
      <SectionIndicator />
      <Cursor />
    </>,
    document.body,
  )
}
