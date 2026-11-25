import { createPortal } from 'react-dom'
import Nav from '../Nav/Nav'
import MobileMenu from '../MobileMenu/MobileMenu'
import Cursor from './Cursor'
import InvertToggle from './InvertToggle'
import SectionIndicator from './SectionIndicator'

/**
 * body 직속 portal. Fragment라 래퍼 요소 없이 각 요소가 body의 자식이 된다
 * → mix-blend-mode: difference 가 페이지 전체와 섞인다.
 */
export default function FixedLayer() {
  return createPortal(
    <>
      <Nav variant="fixed" />
      <InvertToggle />
      <SectionIndicator />
      <MobileMenu />
      <Cursor />
    </>,
    document.body,
  )
}
