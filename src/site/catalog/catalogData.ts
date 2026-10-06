import type { CatalogProduct } from './catalogTypes'

// Dados do catálogo inicial. A cópia histórica da Landing 1 permanece intacta.
// As mesmas fotografias já possuem versões WebP na biblioteca oficial.
export const catalogProducts: CatalogProduct[] = [
  {
    id: 'memoria-em-flor',
    name: 'Memória em Flor',
    image: { src: '/ravera/landing3/jogo-banheiro-rose.webp', alt: 'Dispenser, difusor e bandeja orgânica em resina com pedras rosé e detalhes dourados', width: 656, height: 880 },
    summary: 'Peça autoral para eternizar lembranças afetivas em uma composição delicada, tátil e silenciosa.',
    material: 'Resina artística, acabamento manual e base em tom perolado',
    size: '18 x 24 cm',
  },
  {
    id: 'curva-da-materia',
    name: 'Curva da Matéria',
    image: { src: '/ravera/landing3/porta-joias-emanuelly.webp', alt: 'Porta-joias com flor eternizada, o nome Emanuelly e borda dourada, entre joias', width: 640, height: 880 },
    summary: 'Objeto de decoração com leitura escultórica, criado para compor aparadores, nichos e mesas laterais.',
    material: 'Madeira selecionada, selador fosco e detalhes em tom vinho',
    size: '28 x 16 cm',
  },
  {
    id: 'geometria-quieta',
    name: 'Geometria Quieta',
    image: { src: '/ravera/landing3/difusor-bandeja-rose.webp', alt: 'Difusor em resina com pedras rosé, aro dourado e varetas, ao lado de flores', width: 604, height: 880 },
    summary: 'Peça de presença gráfica para ambientes que pedem contraste, ritmo e uma composição mais arquitetônica.',
    material: 'Madeira, resina pigmentada e acabamento acetinado',
    size: '32 x 32 cm',
  },
  {
    id: 'relicario-de-mesa',
    name: 'Relicário de Mesa',
    image: { src: '/ravera/landing3/relogio-marmore-negro.webp', alt: 'Relógio de parede em resina negra marmorizada com algarismos romanos sobre um aparador', width: 652, height: 896 },
    summary: 'Composição compacta para lembranças pessoais, indicada para mesa de cabeceira, estante ou presente afetivo.',
    material: 'Resina translúcida, pigmento mineral e acabamento polido',
    size: '14 x 14 cm',
  },
  {
    id: 'essencia-ravera',
    name: 'Essência Ravera',
    image: { src: '/ravera/landing3/lembranca-noiva-barbara.webp', alt: 'Noiva segurando uma peça em resina com o nome Bárbara e borda dourada', width: 407, height: 562 },
    summary: 'Peça manifesto da marca, com linguagem material mais marcante e acabamento de caráter colecionável.',
    material: 'Composição mista, madeira, resina e aplicação manual',
    size: '36 x 24 cm',
  },
]

export const catalogById = new Map(catalogProducts.map((product) => [product.id, product]))
