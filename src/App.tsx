import { Suspense, lazy } from 'react'
import LandingThree from './site/landing3/LandingThree'

const LandingOne = lazy(() => import('./alternatives/landing1/LandingOne'))
const LandingTwo = lazy(() => import('./alternatives/landing2/LandingTwo'))

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/prototipos/landing1') return <Suspense fallback={null}><LandingOne /></Suspense>
  if (path === '/prototipos/landing2') return <Suspense fallback={null}><LandingTwo /></Suspense>
  if (path === '/prototipos/catalogo') return <Suspense fallback={null}><LandingOne view="catalog" /></Suspense>
  if (path.startsWith('/prototipos/catalogo/')) return <Suspense fallback={null}><LandingOne view="product" productSlug={path.split('/').pop()} /></Suspense>
  return <LandingThree />
}
