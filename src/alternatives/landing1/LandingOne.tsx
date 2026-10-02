import { useEffect, type ReactNode } from 'react'

import './landing1.css'

type LandingOneView = 'home' | 'catalog' | 'product'

const products = [
  {
    slug: 'memoria-em-flor',
    name: 'Memória em Flor',
    price: 'R$ 420',
    image: '/ravera/portfolio/Screenshot From 2026-09-22 10-33-59.png',
    summary: 'Peça autoral para eternizar lembranças afetivas em uma composição delicada, tátil e silenciosa.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lorem sed velit cursus pretium. A peça nasce de uma escuta cuidadosa e se transforma em presença: um objeto pensado para guardar afeto sem perder leveza visual.',
    material: 'Resina artística, acabamento manual e base em tom perolado',
    size: '18 x 24 cm',
  },
  {
    slug: 'curva-da-materia',
    name: 'Curva da Matéria',
    price: 'R$ 560',
    image: '/ravera/portfolio/Screenshot From 2026-09-22 10-34-29.png',
    summary: 'Objeto de decoração com leitura escultórica, criado para compor aparadores, nichos e mesas laterais.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel augue at lectus convallis lacinia. A superfície valoriza pequenas irregularidades e cria uma relação íntima entre matéria, luz e sombra.',
    material: 'Madeira selecionada, selador fosco e detalhes em tom vinho',
    size: '28 x 16 cm',
  },
  {
    slug: 'geometria-quieta',
    name: 'Geometria Quieta',
    price: 'R$ 690',
    image: '/ravera/portfolio/Screenshot From 2026-09-22 10-34-19.png',
    summary: 'Peça de presença gráfica para ambientes que pedem contraste, ritmo e uma composição mais arquitetônica.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in ligula at justo tempor posuere. A geometria aparece sem excesso, como um desenho contido que organiza o espaço e convida o olhar a permanecer.',
    material: 'Madeira, resina pigmentada e acabamento acetinado',
    size: '32 x 32 cm',
  },
  {
    slug: 'relicario-de-mesa',
    name: 'Relicário de Mesa',
    price: 'R$ 380',
    image: '/ravera/portfolio/Screenshot From 2026-09-22 10-33-45.png',
    summary: 'Composição compacta para lembranças pessoais, indicada para mesa de cabeceira, estante ou presente afetivo.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi gravida erat ut risus facilisis, vitae tempor sem porttitor. O relicário trabalha a ideia de memória próxima, cotidiana e discretamente presente.',
    material: 'Resina translúcida, pigmento mineral e acabamento polido',
    size: '14 x 14 cm',
  },
  {
    slug: 'essencia-ravera',
    name: 'Essência Ravera',
    price: 'R$ 740',
    image: '/ravera/portfolio/Screenshot From 2026-09-22 10-35-15.png',
    summary: 'Peça manifesto da marca, com linguagem material mais marcante e acabamento de caráter colecionável.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id neque eget libero pulvinar faucibus. A peça reúne os códigos visuais da RAVERA em uma leitura sofisticada de matéria, proporção e memória.',
    material: 'Composição mista, madeira, resina e aplicação manual',
    size: '36 x 24 cm',
  },
]

const instagram = 'https://www.instagram.com/ravera.designn/'
const catalogHref = '/prototipos/catalogo'

function BrandMark() {
  return (
    <img
      className="rv-logo"
      src="/ravera/ravera-logo-wine-transparent.png"
      width={1188}
      height={722}
      loading="eager"
      decoding="async"
      alt="RAVERA — Peças Autorais de Design"
    />
  )
}

function InstagramLink({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <a className={className} href={instagram} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span></a>
}

function ProductCard({ product }: { product: typeof products[number] }) {
  return (
    <article className="rv1-product-card">
      <a href={`/prototipos/catalogo/${product.slug}`} aria-label={`Ver ${product.name}`}>
        <div className="rv1-product-image">
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
        </div>
        <div className="rv1-product-meta">
          <h3>{product.name}</h3>
          <p>{product.summary}</p>
          <span>{product.price}</span>
        </div>
      </a>
    </article>
  )
}

function DirectionOne({ view = 'home', productSlug }: { view?: LandingOneView; productSlug?: string }) {
  const selectedProduct = products.find((product) => product.slug === productSlug)

  if (view === 'catalog') {
    return (
      <div className="ravera rv-one rv1-catalog-page" id="topo">
        <header className="rv1-simple-header rv-container">
          <a href="/prototipos/catalogo" className="rv1-brand" aria-label="RAVERA, início"><BrandMark /></a>
          <nav aria-label="Navegação do catálogo"><a href="/prototipos/landing1">Início</a><a href="/prototipos/catalogo">Catálogo</a><a href="/prototipos/landing1#contato">Contato</a></nav>
        </header>
        <main>
          <section className="rv1-catalog-hero rv-container">
            <p className="rv-kicker">Catálogo RAVERA</p>
            <h1>Peças autorais para comprar, presentear e guardar.</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Uma seleção comercial com linguagem curada, materiais sensíveis e objetos criados para permanecer no cotidiano.</p>
          </section>
          <section className="rv1-catalog-grid rv-container" aria-label="Produtos">
            {products.map((product) => <ProductCard key={product.slug} product={product} />)}
          </section>
        </main>
      </div>
    )
  }

  if (view === 'product') {
    const product = selectedProduct ?? products[0]
    return (
      <div className="ravera rv-one rv1-product-page" id="topo">
        <header className="rv1-simple-header rv-container">
          <a href="/prototipos/landing1" className="rv1-brand" aria-label="RAVERA, início"><BrandMark /></a>
          <nav aria-label="Navegação do produto"><a href="/prototipos/landing1">Início</a><a href="/prototipos/catalogo">Catálogo</a><a href="/prototipos/landing1#contato">Contato</a></nav>
        </header>
        <main className="rv1-product-detail rv-container">
          <div className="rv1-product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          <section className="rv1-product-detail-copy" aria-labelledby="product-title">
            <a className="rv1-back-link" href="/prototipos/catalogo">Voltar ao catálogo</a>
            <p className="rv-kicker">Peça autoral</p>
            <h1 id="product-title">{product.name}</h1>
            <p className="rv1-product-lead">{product.summary}</p>
            <p>{product.description}</p>
            <dl>
              <div><dt>Material</dt><dd>{product.material}</dd></div>
              <div><dt>Dimensões</dt><dd>{product.size}</dd></div>
              <div><dt>Valor</dt><dd>{product.price}</dd></div>
            </dl>
            <InstagramLink className="rv-outline-link">Consultar disponibilidade</InstagramLink>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="ravera rv-one" id="topo">
      <a className="rv-skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="rv1-header">
        <nav aria-label="Navegação principal" className="rv1-nav rv1-nav-left"><a href="#colecao">Coleção</a><a href="#visao">A marca</a></nav>
        <a href="#topo" className="rv1-brand" aria-label="RAVERA, início"><BrandMark /></a>
        <nav aria-label="Navegação complementar" className="rv1-nav rv1-nav-right"><a href="/prototipos/catalogo">Catálogo</a><a href="#contato">Contato</a></nav>
      </header>
      <main id="conteudo">
        <section className="rv1-hero rv-container" aria-labelledby="rv1-title">
          <div className="rv1-hero-copy rv-enter">
            <p className="rv-kicker">RAVERA <span /> Peças Autorais de Design</p>
            <h1 id="rv1-title">Objetos com presença, memória e acabamento autoral.</h1>
            <p className="rv1-intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit. A RAVERA cria peças decorativas e afetivas para ambientes que pedem silêncio, matéria e intenção.</p>
            <div className="rv1-hero-actions">
              <a className="rv-outline-link" href="/prototipos/catalogo">Ver catálogo</a>
              <a className="rv-text-link" href={catalogHref}>Conhecer a coleção <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="rv1-hero-panel">
            <span>Ateliê autoral</span>
            <p>Peças sob curadoria, pequenas séries e composições feitas para transformar lembranças em objeto.</p>
          </div>
        </section>

        <section id="colecao" className="rv1-curated rv-container" aria-labelledby="rv1-curated-title">
          <div className="rv1-section-heading">
            <p className="rv-kicker">Coleção em destaque</p>
            <h2 id="rv1-curated-title">Cinco caminhos para escolher uma peça com intenção.</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proporções, texturas e narrativas afetivas em uma seleção mais completa.</p>
          </div>
          <div className="rv1-feature-grid">
            {products.slice(0, 3).map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
          <div className="rv1-section-cta">
            <a className="rv-outline-link" href="/prototipos/catalogo">Ver catálogo completo</a>
          </div>
        </section>

        <section id="visao" className="rv1-vision rv-container" aria-labelledby="rv1-vision-title">
          <p className="rv-kicker">Nossa visão</p>
          <div className="rv1-vision-body">
            <h2 id="rv1-vision-title">O objeto também pode organizar a memória de um lugar.</h2>
            <div className="rv1-copy-stack">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mattis, justo sed volutpat interdum, neque lorem feugiat libero, sed volutpat risus erat sed magna.</p>
              <p>Morbi vitae posuere neque. A peça certa cria pausa, conduz o olhar e transforma pequenos rituais em presença cotidiana.</p>
              <a className="rv-text-link" href="/prototipos/catalogo">Explorar peças disponíveis <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>


        <section id="materia" className="rv1-material" aria-labelledby="rv1-material-title">
          <div className="rv1-material-bg" aria-hidden="true">
            <img
              src="/ravera/portfolio/Screenshot From 2026-09-22 10-34-29-rotated.png"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="rv1-material-inner rv-container">
            <div className="rv1-material-copy">
              <p className="rv-kicker">Matéria e processo</p>

              <h2 id="rv1-material-title">
                Entre textura, cor e gesto manual.
              </h2>

              <p>
                Cada peça parte de uma combinação entre referência, matéria e
                acabamento, com decisões feitas em pequena escala.
              </p>

              <ul>
                <li>Curadoria de materiais e tons da marca</li>
                <li>Produção em baixa escala</li>
                <li>Possibilidade de conversa para encomendas</li>
              </ul>

              <a className="rv-outline-link" href="/prototipos/catalogo">
                Escolher uma peça
              </a>
            </div>
          </div>
        </section>


        <section className="rv1-info-band rv-container" aria-label="Diferenciais RAVERA">
          <article><h3>Pequenas séries</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nada aqui precisa parecer industrial.</p></article>
          <article><h3>Presença material</h3><p>Vivamus luctus, massa sed gravida feugiat, cria uma leitura tátil e contemporânea.</p></article>
          <article><h3>Compra assistida</h3><p>Nullam vel lectus vel lorem finibus dictum para escolher formato, intenção e uso.</p></article>
        </section>

        <section id="contato" className="rv1-contact rv-container">
          <p className="rv-kicker">Contato</p>
          <h2 id="rv1-contact-title">Uma conversa pode ser o início de uma peça.</h2>
          <div className="rv1-contact-copy">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Conte o que você procura: presente, decoração, lembrança afetiva ou uma peça sob medida.</p>
            <div className="rv1-contact-actions">
              <a className="rv-outline-link" href="/prototipos/catalogo">Abrir catálogo</a>
              <InstagramLink className="rv-text-link">Instagram</InstagramLink>
            </div>
          </div>
        </section>
      </main>
      <footer className="rv1-footer rv-container">
        <span>RAVERA — Peças Autorais de Design</span>
        <a href="#topo">Voltar ao início ↑</a>
      </footer>
    </div>
  )
}


export default function LandingOne({ view, productSlug }: { view?: LandingOneView; productSlug?: string }) {
  useEffect(() => { document.title = 'RAVERA — Peças Autorais de Design | Editorial' }, [])
  return <DirectionOne view={view} productSlug={productSlug} />
}



