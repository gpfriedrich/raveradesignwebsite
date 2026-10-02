// Conteúdo da landing3 separado da marcação: quando o catálogo/sistema
// existir, é este arquivo que passa a vir de uma API.

export const INSTAGRAM_HANDLE = 'ravera.designn'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`
// ig.me abre direto a conversa (DM) com o perfil.
export const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`
// Preencher só com dígitos (ex.: 5544999999999) quando a cliente passar o número.
// Enquanto estiver vazio, o formulário de encomenda usa o Instagram.
export const WHATSAPP_NUMBER = ''
// "30 dias" veio das anotações da cliente — confirmar se é o prazo de produção.
export const LEAD_TIME = '30 dias'

const img = (name: string) => `/ravera/landing3/${name}.webp`

export type Category = {
  id: string
  numeral: string
  name: string
  items: string
  description: string
  image?: { src: string; alt: string }
}

export const categories: Category[] = [
  {
    id: 'eternizacao',
    numeral: 'I',
    name: 'Eternização',
    items: 'Buquês de noiva · lembranças de bebê',
    description: 'Flores, datas e pequenos objetos selados em resina para virar peça de guardar e de mostrar.',
    image: { src: img('porta-joias-emanuelly'), alt: 'Porta-joias em resina com uma flor eternizada, o nome Emanuelly e borda dourada' },
  },
  {
    id: 'decoracao',
    numeral: 'II',
    name: 'Decoração',
    items: 'Bandejas · porta-copos · jogos de banheiro',
    description: 'Peças do dia a dia com acabamento de joia: brilho, transparência e detalhes em dourado.',
    image: { src: img('jogo-banheiro-rose'), alt: 'Jogo de banheiro em resina com pedras em tom rosé e detalhes dourados' },
  },
  {
    id: 'relogios',
    numeral: 'III',
    name: 'Relógios',
    items: 'Relógios de parede',
    description: 'Mostradores únicos, marmorizados à mão — nenhum veio se repete.',
    image: { src: img('relogio-marmore-negro'), alt: 'Relógio de parede em resina negra marmorizada com algarismos romanos' },
  },
  {
    id: 'mesas',
    numeral: 'IV',
    name: 'Mesas',
    items: 'Mesas de centro · mesas de apoio',
    description: 'Madeira e resina em peças de presença, pensadas para o centro da sala.',
  },
  {
    id: 'jogos',
    numeral: 'V',
    name: 'Jogos',
    items: 'Xadrez · dominó',
    description: 'Tabuleiros e peças para jogar — e para deixar à vista quando a partida acaba.',
  },
  {
    id: 'tabuas',
    numeral: 'VI',
    name: 'Tábuas',
    items: 'Tábuas de carne · facas',
    description: 'Utensílios em madeira e resina para servir com cuidado.',
  },
  {
    id: 'personalizacao',
    numeral: 'VII',
    name: 'Personalização',
    items: 'Nomes · datas · cores sob encomenda',
    description: 'Qualquer peça pode levar um nome, uma data ou as cores de uma história.',
    image: { src: img('lembranca-noiva-barbara'), alt: 'Noiva segurando uma peça em resina com o nome Bárbara em dourado' },
  },
]

export type Piece = {
  name: string
  category: string
  description: string
  // Regra da cliente: peça pronta mostra preço; encomenda é sob consulta.
  price: string | null
  image: { src: string; alt: string; width: number; height: number }
}

export const pieces: Piece[] = [
  {
    name: 'Relógio Mármore Negro',
    category: 'Relógios',
    description: 'Resina negra com veios marmorizados e algarismos romanos.',
    price: null,
    image: { src: img('relogio-marmore-negro'), alt: 'Relógio de parede em resina negra marmorizada sobre um aparador', width: 652, height: 896 },
  },
  {
    name: 'Porta-joias Emanuelly',
    category: 'Eternização',
    description: 'Flor eternizada, nome, data e borda em dourado.',
    price: null,
    image: { src: img('porta-joias-emanuelly'), alt: 'Porta-joias em resina com flor eternizada, brincos e correntes douradas', width: 640, height: 880 },
  },
  {
    name: 'Jogo de Banheiro Rosé',
    category: 'Decoração',
    description: 'Dispenser, difusor e bandeja orgânica com pedras em tom rosé.',
    price: null,
    image: { src: img('jogo-banheiro-rose'), alt: 'Dispenser e difusor em resina com pedras rosé sobre bandeja orgânica', width: 656, height: 880 },
  },
  {
    name: 'Difusor Rosé',
    category: 'Decoração',
    description: 'Pedras em tom rosé, aro dourado e varetas naturais.',
    price: null,
    image: { src: img('difusor-bandeja-rose'), alt: 'Difusor em resina com pedras rosé ao lado de flores', width: 604, height: 880 },
  },
]

export const steps = [
  { numeral: 'I', title: 'Conversa', text: 'Você conta a história e o que deseja guardar — flores, datas, nomes, cores.' },
  { numeral: 'II', title: 'Proposta', text: 'Definimos em conjunto o formato da peça, o acabamento e o valor da encomenda.' },
  { numeral: 'III', title: 'Criação', text: 'A peça é feita à mão, em camadas, respeitando o tempo de cura da resina.' },
  { numeral: 'IV', title: 'Entrega', text: 'Sua história, pronta para ficar à vista por muitos e muitos anos.' },
]
