import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import {
  INSTAGRAM_DM_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  LEAD_TIME,
  WHATSAPP_NUMBER,
  categories,
  pieces,
  steps,
} from './content'
import './landing3.css'

const navLinks = [
  { href: '#eternizacao', label: 'Eternização' },
  { href: '#colecao', label: 'Coleção' },
  { href: '#pecas', label: 'Peças' },
  { href: '#encomenda', label: 'Encomendas' },
]

// Também está no landing3/index.html (carrega mais cedo no build). No dev o
// Vite serve o index.html da raiz para /landing3, então o componente garante.
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap'

const marqueeWords = ['Buquês de noiva', 'Lembranças de bebê', 'Relógios', 'Mesas', 'Bandejas', 'Xadrez', 'Dominó', 'Tábuas', 'Personalização']

// Contorno irregular inspirado na borda das peças dela (porta-joias e bandejas
// com beirada "mordida" e filete dourado). Soma de senoides sobre um círculo:
// frequências baixas deformam o todo, as altas fazem o recorte fino da borda.
// O seed fixo garante o mesmo desenho em todo carregamento.
function geodePoints(seed: number, count = 140) {
  let state = seed
  const random = () => {
    state = (state * 16807) % 2147483647
    return state / 2147483647
  }
  const waves = [2, 3, 7, 11, 23, 31].map((frequency) => ({
    frequency,
    amplitude: (frequency < 5 ? 0.9 : frequency < 15 ? 0.6 : 0.25) * (0.6 + random() * 0.8),
    phase: random() * Math.PI * 2,
  }))

  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2
    const radius = 45 + waves.reduce((sum, wave) => sum + wave.amplitude * Math.sin(wave.frequency * angle + wave.phase), 0)
    return [50 + radius * Math.cos(angle), 50 + radius * Math.sin(angle)]
  })
}

type GeodeProps = {
  src: string
  alt: string
  seed: number
  className?: string
  eager?: boolean
  // Ponto da foto que deve ficar no centro do recorte e quanto aproximar.
  focus?: string
  zoom?: number
}

function Geode({ src, alt, seed, className = '', eager = false, focus = '50% 50%', zoom = 1 }: GeodeProps) {
  const points = useMemo(() => geodePoints(seed), [seed])
  const clipPath = `polygon(${points.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')})`

  return (
    <figure className={`ts-geode ${className}`}>
      <div className="ts-geode-clip" style={{ clipPath }}>
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: focus, transformOrigin: focus, scale: zoom }} />
      </div>
      <svg className="ts-geode-rim" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon points={points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')} />
      </svg>
    </figure>
  )
}

// Mostrador de relógio (as peças dela usam algarismos romanos). O ponto dourado
// dá uma volta por minuto em torno da peça — o tempo passa, a memória fica.
function Dial() {
  const numerals: [string, number, number][] = [['XII', 200, 38], ['III', 364, 205], ['VI', 200, 372], ['IX', 36, 205]]
  return (
    <svg className="ts-dial" viewBox="0 0 400 400" aria-hidden="true">
      <circle className="ts-dial-ring" cx="200" cy="200" r="198" />
      {Array.from({ length: 60 }, (_, index) => (
        <line
          key={index}
          className={index % 5 === 0 ? 'is-major' : undefined}
          x1="200"
          y1="4"
          x2="200"
          y2={index % 5 === 0 ? 18 : 11}
          transform={`rotate(${index * 6} 200 200)`}
          style={{ '--tick': index } as CSSProperties}
        />
      ))}
      {numerals.map(([label, x, y]) => (
        <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle">{label}</text>
      ))}
      <g className="ts-dial-orbit">
        <circle cx="200" cy="2" r="3.2" />
      </g>
    </svg>
  )
}

function Logo({ stacked = false }: { stacked?: boolean }) {
  return (
    <span className={`ts-logo${stacked ? ' ts-logo--stacked' : ''}`}>
      <span className="ts-logo-mark">R</span>
      <span className="ts-logo-word">RAVERA</span>
      {stacked && <span className="ts-logo-tag">Peças autorais de design</span>}
    </span>
  )
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <header className={`ts-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}>
      <div className="ts-container ts-header-inner">
        <a href="#topo" className="ts-header-brand" aria-label="RAVERA — Peças autorais de design, início" onClick={() => setMenuOpen(false)}>
          <Logo />
        </a>
        <nav className="ts-nav" aria-label="Navegação principal">
          {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <a className="ts-button ts-button--gold ts-header-cta" href="#encomenda">Encomendar</a>
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
        {navLinks.map((link, index) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ '--item': index } as CSSProperties}>
            {link.label}
          </a>
        ))}
        <a className="ts-mobile-menu-ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@{INSTAGRAM_HANDLE} ↗</a>
      </nav>
    </header>
  )
}

function CategoryIndex() {
  const [activeId, setActiveId] = useState(categories[0].id)
  const active = categories.find((category) => category.id === activeId) ?? categories[0]

  return (
    <div className="ts-index">
      <ol className="ts-index-list">
        {categories.map((category) => {
          const isActive = category.id === activeId
          return (
            <li key={category.id} className={isActive ? 'is-active' : undefined}>
              <button
                type="button"
                aria-expanded={isActive}
                aria-controls={`ts-cat-${category.id}`}
                onMouseEnter={() => setActiveId(category.id)}
                onFocus={() => setActiveId(category.id)}
                onClick={() => setActiveId(category.id)}
              >
                <span className="ts-index-numeral">{category.numeral}</span>
                <span className="ts-index-name">{category.name}</span>
                <span className="ts-index-items">{category.items}</span>
              </button>
              <div id={`ts-cat-${category.id}`} className="ts-index-detail">
                <div>
                  <p>{category.description}</p>
                  {category.image && <img src={category.image.src} alt={category.image.alt} loading="lazy" decoding="async" />}
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="ts-index-preview">
        <div className="ts-index-frame">
          {categories.map((category) => (
            category.image
              ? <img key={category.id} className={category.id === activeId ? 'is-active' : undefined} src={category.image.src} alt={category.id === activeId ? category.image.alt : ''} loading="lazy" decoding="async" />
              : (
                <div key={category.id} className={`ts-index-placeholder${category.id === activeId ? ' is-active' : ''}`} aria-hidden={category.id !== activeId}>
                  <span>{category.numeral}</span>
                  <p>Fotos em breve</p>
                </div>
              )
          ))}
        </div>
        <p className="ts-index-caption"><strong>{active.name}</strong> — {active.description}</p>
      </div>
    </div>
  )
}

function OrderForm() {
  const [sentMessage, setSentMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const channel = WHATSAPP_NUMBER ? 'WhatsApp' : 'Instagram'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('nome') ?? '').trim()
    const kind = String(data.get('peca') ?? '')
    const story = String(data.get('historia') ?? '').trim()
    const message = [
      `Olá, Ravera! Meu nome é ${name}.`,
      `Tenho interesse em: ${kind}.`,
      story && `Sobre a peça: ${story}`,
    ].filter(Boolean).join('\n')

    if (WHATSAPP_NUMBER) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
      return
    }

    // O Instagram não aceita texto pré-preenchido na DM: copiamos a mensagem
    // e abrimos a conversa. A cópia começa antes do window.open porque a
    // Clipboard API exige que a aba ainda esteja em foco.
    setCopied(false)
    navigator.clipboard?.writeText(message).then(() => setCopied(true), () => setCopied(false))
    setSentMessage(message)
    window.open(INSTAGRAM_DM_URL, '_blank', 'noopener')
  }

  return (
    <form className="ts-form" onSubmit={handleSubmit}>
      <p className="ts-form-title">Monte seu pedido</p>
      <label>
        <span>Seu nome</span>
        <input name="nome" type="text" autoComplete="given-name" required />
      </label>
      <label>
        <span>Que tipo de peça?</span>
        <select name="peca" required defaultValue="">
          <option value="" disabled>Escolha uma opção</option>
          {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
          <option value="Ainda não sei">Ainda não sei</option>
        </select>
      </label>
      <label>
        <span>Conte a história <small>(opcional)</small></span>
        <textarea name="historia" rows={4} placeholder="Ex.: quero eternizar o buquê do meu casamento, que foi em março…" />
      </label>
      <button type="submit" className="ts-button ts-button--wine">Continuar no {channel} <span aria-hidden="true">↗</span></button>
      <p className="ts-form-note">Nada é enviado por este site: a mensagem é montada aqui e você decide se envia pelo {channel}.</p>
      {sentMessage && (
        <div className="ts-form-status" role="status">
          <p>{copied ? `Mensagem copiada — é só colar na conversa com @${INSTAGRAM_HANDLE}.` : `Copie a mensagem abaixo e cole na conversa com @${INSTAGRAM_HANDLE}.`}</p>
          <pre>{sentMessage}</pre>
        </div>
      )}
    </form>
  )
}

export default function LandingThree() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'RAVERA — Peças Autorais de Design | Tempo Suspenso'
    document.documentElement.lang = 'pt-BR'
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (favicon) {
      favicon.href = '/ravera/favicon.png'
      favicon.type = 'image/png'
    }
    if (!document.querySelector('link[data-ts-fonts]')) {
      const fonts = document.createElement('link')
      fonts.rel = 'stylesheet'
      fonts.href = FONTS_URL
      fonts.dataset.tsFonts = ''
      document.head.append(fonts)
    }
  }, [])

  // Revela as seções ao entrar na tela. Sem IntersectionObserver ou com
  // "reduzir movimento" ligado, a classe ts--motion nunca entra e tudo já
  // aparece visível pelo CSS.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    root.classList.add('ts--motion')
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -12% 0px' })
    root.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="ts" id="topo" ref={rootRef}>
      <a className="ts-skip" href="#conteudo">Pular para o conteúdo</a>
      <Header />

      <main id="conteudo">
        <section className="ts-hero ts-dark" aria-labelledby="ts-hero-title">
          <div className="ts-container ts-hero-grid">
            <div className="ts-hero-copy">
              <p className="ts-kicker">Peças autorais em resina e madeira</p>
              <h1 id="ts-hero-title">Fragmentos de história, <em>suspensos</em> no tempo.</h1>
              <p className="ts-hero-lead">
                Peças únicas de decoração e a eternização de buquês de noiva, lembranças de bebê e tudo o que merece durar.
              </p>
              <div className="ts-hero-actions">
                <a className="ts-button ts-button--gold" href="#encomenda">Eternizar uma memória</a>
                <a className="ts-link" href="#colecao">Ver a coleção <span aria-hidden="true">↓</span></a>
              </div>
            </div>

            <div className="ts-hero-art">
              <Dial />
              <Geode
                className="ts-hero-geode"
                seed={7}
                focus="64% 34%"
                zoom={1.3}
                eager
                src="/ravera/landing3/porta-joias-emanuelly.webp"
                alt="Porta-joias em resina com uma flor eternizada, o nome Emanuelly e a data 06/09/2026"
              />
              <Geode
                className="ts-hero-geode-small"
                seed={31}
                focus="42% 70%"
                zoom={1.45}
                eager
                src="/ravera/landing3/lembranca-noiva-barbara.webp"
                alt="Noiva segurando uma peça em resina com o nome Bárbara em dourado"
              />
              <p className="ts-hero-art-caption"><span>Eternização</span> flor, nome e data em resina</p>
            </div>
          </div>

          <div className="ts-marquee" aria-hidden="true">
            <div className="ts-marquee-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="ts-marquee-group">
                  {marqueeWords.map((word) => <span key={word}>{word}<i /></span>)}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="origem" className="ts-origin" aria-labelledby="ts-origin-title">
          <div className="ts-container ts-origin-grid">
            <blockquote className="ts-origin-quote" data-reveal>
              <p>A Ravera não transforma apenas objetos em resina. Transforma <em>fragmentos de história</em> em peças autorais de design.</p>
            </blockquote>
            <div className="ts-origin-copy" data-reveal>
              <p className="ts-kicker">A origem</p>
              <h2 id="ts-origin-title">Nasceu perto das noivas.</h2>
              <p>
                A Ravera surgiu do desejo de criar peças exclusivas e de eternizar buquês de noiva. Quem está por trás dela é
                cabeleireira e trabalha lado a lado com noivas — conhece de perto o valor de cada detalhe do grande dia.
              </p>
              <ul className="ts-values">
                <li><strong>Elegância</strong><span>Formas limpas e acabamento de joia.</span></li>
                <li><strong>Refinamento</strong><span>Cada peça é única, feita à mão.</span></li>
                <li><strong>Memória</strong><span>O que importa, preservado.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section id="eternizacao" className="ts-eternal ts-dark" aria-labelledby="ts-eternal-title">
          <div className="ts-container ts-eternal-grid">
            <div className="ts-eternal-photo" data-reveal>
              <img src="/ravera/landing3/lembranca-noiva-barbara.webp" alt="Noiva de vestido branco segurando uma peça em resina com o nome Bárbara e borda dourada" loading="lazy" decoding="async" />
            </div>
            <div className="ts-eternal-copy" data-reveal>
              <p className="ts-kicker">Eternização</p>
              <h2 id="ts-eternal-title">O buquê murcha. <em>A lembrança, não.</em></h2>
              <p>
                Selamos em resina o que é passageiro — as flores do casamento, as lembranças do bebê, a flor de uma data especial —
                e transformamos em peça: porta-joias, bandeja, quadro ou relógio, com nome, data e detalhes em dourado.
              </p>
              <ul className="ts-chips">
                <li>Buquês de noiva</li>
                <li>Lembranças de bebê</li>
                <li>Flores de datas especiais</li>
                <li>Nome e data em dourado</li>
              </ul>
              <div className="ts-eternal-actions">
                <a className="ts-button ts-button--gold" href="#encomenda">Quero eternizar</a>
                <span className="ts-eternal-note">Sob encomenda · prazo médio de {LEAD_TIME}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="colecao" className="ts-collection" aria-labelledby="ts-collection-title">
          <div className="ts-container">
            <div className="ts-section-head" data-reveal>
              <p className="ts-kicker">Coleção</p>
              <h2 id="ts-collection-title">Sete universos, <em>uma assinatura.</em></h2>
            </div>
            <div data-reveal>
              <CategoryIndex />
            </div>
          </div>
        </section>

        <section id="pecas" className="ts-pieces" aria-labelledby="ts-pieces-title">
          <div className="ts-container">
            <div className="ts-section-head ts-section-head--split" data-reveal>
              <div>
                <p className="ts-kicker">Peças recentes</p>
                <h2 id="ts-pieces-title">Direto do ateliê.</h2>
              </div>
              <a className="ts-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Ver mais no Instagram <span aria-hidden="true">↗</span></a>
            </div>
            <ul className="ts-pieces-grid">
              {pieces.map((piece) => (
                <li key={piece.name} className="ts-piece" data-reveal>
                  <div className="ts-piece-image">
                    <img src={piece.image.src} alt={piece.image.alt} width={piece.image.width} height={piece.image.height} loading="lazy" decoding="async" />
                  </div>
                  <p className="ts-piece-category">{piece.category}</p>
                  <h3>{piece.name}</h3>
                  <p className="ts-piece-description">{piece.description}</p>
                  <p className="ts-piece-price">{piece.price ?? 'Valor sob consulta'}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="encomenda" className="ts-order" aria-labelledby="ts-order-title">
          <div className="ts-container ts-order-grid">
            <div className="ts-order-copy" data-reveal>
              <p className="ts-kicker">Encomendas</p>
              <h2 id="ts-order-title">Qual história você quer guardar?</h2>
              <ol className="ts-steps">
                {steps.map((step) => (
                  <li key={step.numeral}>
                    <span className="ts-steps-numeral">{step.numeral}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="ts-order-note">Peças prontas têm valor na própria peça. Encomendas e eternizações são sob consulta, com prazo médio de {LEAD_TIME}.</p>
            </div>
            <div data-reveal>
              <OrderForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="ts-footer ts-dark">
        <div className="ts-container ts-footer-inner">
          <a href="#topo" className="ts-footer-brand" aria-label="RAVERA — voltar ao início"><Logo stacked /></a>
          <nav className="ts-footer-nav" aria-label="Rodapé">
            {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
          </nav>
          <p className="ts-footer-legal">© {new Date().getFullYear()} Ravera — Peças autorais de design</p>
        </div>
      </footer>
    </div>
  )
}
