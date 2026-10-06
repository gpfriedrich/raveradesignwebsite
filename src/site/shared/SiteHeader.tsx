import { useEffect, useState, type CSSProperties } from 'react'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from './contact'
import { CATALOG_PATH } from '../catalog/catalogRoutes'
import RaveraLogo from './RaveraLogo'
import { siteLinks } from './navigation'

export default function SiteHeader({ home = false }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const links = siteLinks(home)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <header className={`ts-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}>
      <div className="ts-container ts-header-inner">
        <a href={home ? '#topo' : '/'} className="ts-header-brand" aria-label="RAVERA — Peças autorais de design, início" onClick={() => setMenuOpen(false)}>
          <RaveraLogo />
        </a>
        <nav className="ts-nav" aria-label="Navegação principal">
          {links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
        </nav>
        <a className="ts-button ts-button--gold ts-header-cta" href={`${CATALOG_PATH}/`}>Encomendar</a>
        <button
          type="button"
          className="ts-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="ts-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="ts-menu-icon" aria-hidden="true" />
          <span className="ts-sr-only">{menuOpen ? 'Fechar menu' : 'Abrir menu'}</span>
        </button>
      </div>
      <nav id="ts-mobile-menu" className="ts-mobile-menu" aria-label="Menu" hidden={!menuOpen}>
        {links.map((link, index) => (
          <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={{ '--item': index } as CSSProperties}>
            {link.label}
          </a>
        ))}
        <a className="ts-mobile-menu-ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@{INSTAGRAM_HANDLE} ↗</a>
      </nav>
    </header>
  )
}
