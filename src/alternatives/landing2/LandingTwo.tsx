import { useEffect, useRef, useState, type ReactNode } from 'react'

import './landing2.css'


const instagram = 'https://www.instagram.com/ravera.designn/'
const catalogHref = '/prototipos/catalogo'

function PrototypeLogo() {
  return <span className="ts-logo"><span className="ts-logo-mark">R</span><span className="ts-logo-word">RAVERA</span></span>
}

function BrandMark({ decorative = true, eager = true }: { decorative?: boolean; eager?: boolean }) {
  return (
    <img
      className="rv-logo"
      src="/ravera/Logomarca-Ravera-Design-sem-fundo-bege.png"
      width={1188}
      height={722}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      alt={decorative ? '' : 'RAVERA — Peças Autorais de Design'}
    />
  )
}

function InstagramLink({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <a className={className} href={instagram} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span></a>
}

function LandingTwo() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollSentinelRef = useRef<HTMLSpanElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const target = document.querySelector<HTMLElement>(hash)
    if (!target) return

    const previousBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'
    target.scrollIntoView({ block: 'start' })
    document.documentElement.style.scrollBehavior = previousBehavior
  }, [])

  useEffect(() => {
    const sentinel = scrollSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const viewportLimit = window.innerHeight * .96
    elements.forEach((element) => {
      const bounds = element.getBoundingClientRect()
      if (bounds.top < viewportLimit && bounds.bottom > 0) element.classList.add('is-visible')
    })
    root.classList.add('rv2-motion-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: .12 },
    )

    elements.forEach((element) => {
      if (!element.classList.contains('is-visible')) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sectionIds = ['historia', 'pecas', 'eternizacao', 'materia', 'criacao', 'catalogos', 'contato']
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting)
        if (current) setActiveSection(current.target.id)
      },
      { rootMargin: '-22% 0px -68% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    const menu = menuRef.current
    const focusable = menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    const firstFocusable = focusable?.[0]
    const lastFocusable = focusable?.[focusable.length - 1]

    document.body.style.overflow = 'hidden'
    const focusFrame = window.requestAnimationFrame(() => firstFocusable?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !firstFocusable || !lastFocusable) return
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 901px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }

    desktopQuery.addEventListener('change', closeOnDesktop)
    return () => desktopQuery.removeEventListener('change', closeOnDesktop)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const closeMenuAndRestoreFocus = () => {
    setMenuOpen(false)
    window.requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  return (
    <div className="ravera rv-two" id="topo" ref={rootRef}>
      <a className="rv-skip" href="#conteudo">Pular para o conteúdo</a>
      <span className="rv2-scroll-sentinel" ref={scrollSentinelRef} aria-hidden="true" />
      <header className={`rv2-header${isScrolled ? ' is-scrolled' : ''}`}>
        <div className="rv2-header-inner rv-container">
          <a className="rv2-brand" href="#topo" aria-label="RAVERA, início">
            <PrototypeLogo />
          </a>
          <nav className="rv2-desktop-nav" aria-label="Navegação principal">
            <a href="#pecas" aria-current={activeSection === 'pecas' ? 'location' : undefined}>Peças</a>
            <a href="#eternizacao" aria-current={activeSection === 'eternizacao' ? 'location' : undefined}>Eternização</a>
            <a href={catalogHref}>Catálogo</a>
            <a href="#historia" aria-current={activeSection === 'historia' ? 'location' : undefined}>Sobre</a>
          </nav>
          <a className="rv2-header-contact" href="#contato" aria-current={activeSection === 'contato' ? 'location' : undefined}>Contato <span aria-hidden="true">↗</span></a>
          <button
            className="rv2-menu-button"
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-controls="rv2-mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            ref={menuButtonRef}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>
      <div className={`rv2-menu-layer${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <button className="rv2-menu-backdrop" type="button" aria-label="Fechar menu" onClick={closeMenuAndRestoreFocus} tabIndex={menuOpen ? 0 : -1} />
        <nav id="rv2-mobile-menu" className="rv2-mobile-menu" aria-label="Navegação móvel" ref={menuRef} inert={!menuOpen}>
          <button className="rv2-menu-close" type="button" onClick={closeMenuAndRestoreFocus} aria-label="Fechar menu"><span aria-hidden="true">×</span></button>
          <div className="rv2-mobile-brand">
            <a href="#topo" onClick={closeMenu} aria-label="RAVERA, início">
              <PrototypeLogo />
            </a>
          </div>
          <a href="#topo" onClick={closeMenu}>Início</a>
          <a href="#pecas" onClick={closeMenu} aria-current={activeSection === 'pecas' ? 'location' : undefined}>Peças</a>
          <a href="#eternizacao" onClick={closeMenu} aria-current={activeSection === 'eternizacao' ? 'location' : undefined}>Eternização</a>
          <a href={catalogHref} onClick={closeMenu}>Catálogo</a>
          <a href="#historia" onClick={closeMenu} aria-current={activeSection === 'historia' ? 'location' : undefined}>Sobre</a>
          <a href="#contato" onClick={closeMenu} aria-current={activeSection === 'contato' ? 'location' : undefined}>Contato</a>
          <a className="rv2-mobile-instagram" href={instagram} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Instagram <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
      <main id="conteudo">
        <section className="rv2-hero rv-container" aria-labelledby="rv2-title">
          <div className="rv2-hero-copy rv2-hero-intro">
            <p className="rv-kicker">Peças Autorais de Design</p>
            <h1 id="rv2-title">Há histórias que merecem <em>permanecer.</em></h1>
            <p>Objetos autorais que aproximam design, afeto e aquilo que escolhemos guardar.</p>
            <div className="rv2-hero-actions">
              <a className="rv2-pill-link" href={catalogHref}>Descubra as peças <span aria-hidden="true">↓</span></a>
              <a className="rv2-quiet-link" href={catalogHref}>Conheça a eternização</a>
            </div>
          </div>
          <figure className="rv2-hero-art rv2-hero-intro rv2-hero-intro-delay">
            <div className="rv2-arch">
              <img
                src="/ravera/instagram/porta-joias-personalizado.jpeg"
                width="1600"
                height="1468"
                alt="Porta-joias personalizado com flores preservadas e acabamento dourado"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <figcaption className="rv2-hero-note">Memória, forma e presença</figcaption>
          </figure>
        </section>

        <section id="historia" className="rv2-story" aria-labelledby="rv2-story-title">
          <div className="rv2-story-inner rv-container">
            <figure className="rv2-story-image" data-reveal="image">
              <img
                src="/ravera/instagram/marcadores-claros.jpeg"
                width="1600"
                height="1200"
                alt="Marcadores transparentes com flores preservadas sobre páginas de um livro"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="rv2-story-copy" data-reveal="content">
              <p className="rv-kicker">Nossa essência</p>
              <h2 id="rv2-story-title">O valor de uma peça também vive naquilo que ela evoca.</h2>
              <p>Na RAVERA, design autoral e memória dividem o mesmo espaço. Cada criação convida a reconhecer significado nas formas que permanecem por perto.</p>
              <a className="rv2-quiet-link" href={catalogHref}>Conheça o olhar da RAVERA</a>
            </div>
          </div>
        </section>

        <section id="pecas" className="rv2-pieces rv-container" aria-labelledby="rv2-pieces-title">
          <div className="rv2-section-heading" data-reveal="content">
            <div>
              <p className="rv-kicker">Peças em destaque</p>
              <h2 id="rv2-pieces-title">Objetos que guardam presença.</h2>
            </div>
            <p>Uma seleção real do universo RAVERA, entre peças para a casa e pequenos objetos afetivos.</p>
          </div>
          <div className="rv2-piece-grid">
            <article className="rv2-piece rv2-piece-primary" data-reveal="card">
              <div className="rv2-piece-image">
                <img
                  src="/ravera/instagram/porta-tacas-mesa.jpeg"
                  width="1200"
                  height="1600"
                  alt="Porta-taça translúcido em tons de vinho e âmbar sobre mesa"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="rv2-piece-meta"><h3>Porta-taças</h3><span>Transparência e cor</span></div>
            </article>
            <article className="rv2-piece rv2-piece-square" data-reveal="card">
              <div className="rv2-piece-image">
                <img
                  src="/ravera/instagram/porta-joias-joias.png"
                  width="640"
                  height="880"
                  alt="Porta-joias personalizado com flor preservada e joias douradas"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="rv2-piece-meta"><h3>Porta-joias</h3><span>Detalhe pessoal</span></div>
            </article>
            <article className="rv2-piece rv2-piece-wide" data-reveal="card">
              <div className="rv2-piece-image">
                <img
                  src="/ravera/instagram/relogio-preto.png"
                  width="652"
                  height="896"
                  alt="Relógio de parede preto em composição decorativa"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="rv2-piece-meta"><h3>Relógios</h3><span>Forma no espaço</span></div>
            </article>
            <article className="rv2-piece rv2-piece-detail" data-reveal="card">
              <div className="rv2-piece-image">
                <img
                  src="/ravera/instagram/marcador-vinho.jpeg"
                  width="1200"
                  height="1600"
                  alt="Marcador de página transparente com flores e tassel vinho"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="rv2-piece-meta"><h3>Marcadores</h3><span>Flores preservadas</span></div>
            </article>
          </div>
          <div className="rv2-pieces-catalog" data-reveal="content">
            <a className="rv2-pill-link" href={catalogHref}>Ver catálogo completo <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section id="eternizacao" className="rv2-eternization" aria-labelledby="rv2-eternizacao-title">
          <div className="rv2-eternization-inner rv-container">
            <div className="rv2-eternization-copy" data-reveal="content">
              <p className="rv-kicker">Eternização</p>
              <h2 id="rv2-eternizacao-title">O que é precioso encontra um novo lugar.</h2>
              <p>Flores e pequenas lembranças podem atravessar o tempo como parte de um objeto criado para permanecer por perto.</p>
              <InstagramLink className="rv2-pill-link">Conte sua história</InstagramLink>
            </div>
            <div className="rv2-eternization-gallery" data-reveal="image">
              <figure className="rv2-memory-main">
                <img
                  src="/ravera/instagram/lembranca-celebracao.png"
                  width="407"
                  height="562"
                  alt="Pessoa em traje de celebração segurando uma lembrança floral personalizada"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <figure className="rv2-memory-detail">
                <img
                  src="/ravera/instagram/porta-joias-personalizado.jpeg"
                  width="1600"
                  height="1468"
                  alt="Detalhe de porta-joias personalizado com pétalas preservadas"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <span className="rv2-memory-caption">Lembranças transformadas em presença</span>
            </div>
          </div>
        </section>

        <section id="materia" className="rv2-material rv-container" aria-labelledby="rv2-material-title">
          <div className="rv2-material-visual" data-reveal="image">
            <img
              src="/ravera/instagram/porta-taca-detalhe.jpeg"
              width="1200"
              height="1600"
              alt="Close de porta-taça translúcido com camadas em tons de vinho, âmbar e detalhe botânico"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="rv2-material-copy" data-reveal="content">
            <p className="rv-kicker">Matéria e detalhe</p>
            <h2 id="rv2-material-title">A luz revela cada camada.</h2>
            <p>A transparência, as variações de cor, o desenho das bordas e os elementos preservados dão ritmo e singularidade a cada composição.</p>
            <dl>
              <div><dt>01</dt><dd>Transparência</dd></div>
              <div><dt>02</dt><dd>Camadas de cor</dd></div>
              <div><dt>03</dt><dd>Detalhes botânicos</dd></div>
            </dl>
          </div>
        </section>

        <section id="criacao" className="rv2-process" aria-labelledby="rv2-process-title">
          <div className="rv-container">
            <div className="rv2-process-heading" data-reveal="content">
              <div>
                <p className="rv-kicker">Filosofia de criação</p>
                <h2 id="rv2-process-title">Da intenção à forma.</h2>
              </div>
              <p>Um percurso sensível que começa no significado e termina em um objeto feito para conviver com a sua história.</p>
            </div>
            <div className="rv2-process-grid">
              <div data-reveal="card">
                <span>01</span>
                <h3>História</h3>
                <p>O ponto de partida é aquilo que importa para você.</p>
              </div>
              <div data-reveal="card">
                <span>02</span>
                <h3>Criação</h3>
                <p>Um olhar autoral conduz a expressão da ideia.</p>
              </div>
              <div data-reveal="card">
                <span>03</span>
                <h3>Peça</h3>
                <p>Forma e significado se encontram.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="catalogos" className="rv2-catalogs" aria-labelledby="rv2-catalogs-title">
          <div className="rv2-catalogs-inner rv-container">
            <div className="rv2-catalogs-heading" data-reveal="content">
              <p className="rv-kicker">Catálogo RAVERA</p>
              <h2 id="rv2-catalogs-title">Um acervo para percorrer com tempo.</h2>
              <p>Peças autorais para comprar, presentear e guardar, reunidas no mesmo catálogo apresentado pela RAVERA.</p>
            </div>
            <a className="rv2-catalog-link" href={catalogHref} data-reveal="card">
              <BrandMark />
              <div>
                <span>Catálogo RAVERA</span>
                <h3>Peças autorais para comprar, presentear e guardar.</h3>
                <p>Conheça a seleção completa de peças, materiais e objetos criados para permanecer no cotidiano.</p>
                <span className="rv2-catalog-cta">Abrir catálogo <span aria-hidden="true">↗</span></span>
              </div>
            </a>
          </div>
        </section>

        <section id="contato" className="rv2-contact">
          <div className="rv-container" data-reveal="content">
            <p className="rv-kicker">Contato</p>
            <h2>Qual história você gostaria de contar?</h2>
            <p>Peças autorais, criações personalizadas e memórias que pedem uma forma só sua.</p>
            <InstagramLink className="rv2-pill-link">Fale com a RAVERA</InstagramLink>
          </div>
        </section>
      </main>
      <footer className="rv2-footer">
        <div className="rv2-footer-inner rv-container">
          <div className="rv2-footer-brand">
            <a href="#topo" aria-label="RAVERA, voltar ao início">
              <BrandMark decorative={false} eager={false} />
            </a>
          </div>
          <nav className="rv2-footer-group" aria-label="Navegação do rodapé">
            <p>Navegação</p>
            <a href="#pecas">Peças</a>
            <a href="#eternizacao">Eternização</a>
            <a href="#historia">Sobre</a>
          </nav>
          <nav className="rv2-footer-group" aria-label="Catálogo e contato">
            <p>Descobrir</p>
            <a href={catalogHref}>Catálogo</a>
            <a href="#contato">Contato</a>
            <a href={instagram} target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
        <div className="rv2-footer-bottom rv-container">
          <span>RAVERA — Peças Autorais de Design</span>
          <a href="#topo">Voltar ao início <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </div>
  )
}


export default LandingTwo


