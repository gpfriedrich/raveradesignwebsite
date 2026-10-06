import { INSTAGRAM_URL } from './contact'
import RaveraLogo from './RaveraLogo'
import { siteLinks } from './navigation'

export default function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="ts-footer ts-dark">
      <div className="ts-container ts-footer-inner">
        <a href={home ? '#topo' : '/'} className="ts-footer-brand" aria-label="RAVERA — voltar ao início"><RaveraLogo stacked /></a>
        <nav className="ts-footer-nav" aria-label="Rodapé">
          {siteLinks(home).map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
        </nav>
        <p className="ts-footer-legal">© {new Date().getFullYear()} Ravera — Peças autorais de design</p>
      </div>
    </footer>
  )
}
