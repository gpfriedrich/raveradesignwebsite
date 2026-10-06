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
  image: { src: string; alt: string; width: number; height: number }
}

export const pieces: Piece[] = [
  {
    name: 'Relógio Mármore Negro',
    category: 'Relógios',
    description: 'Resina negra com veios marmorizados e algarismos romanos.',
    image: { src: img('relogio-marmore-negro'), alt: 'Relógio de parede em resina negra marmorizada sobre um aparador', width: 652, height: 896 },
  },
  {
    name: 'Porta-joias Emanuelly',
    category: 'Eternização',
    description: 'Flor eternizada, nome, data e borda em dourado.',
    image: { src: img('porta-joias-emanuelly'), alt: 'Porta-joias em resina com flor eternizada, brincos e correntes douradas', width: 640, height: 880 },
  },
  {
    name: 'Jogo de Banheiro Rosé',
    category: 'Decoração',
    description: 'Dispenser, difusor e bandeja orgânica com pedras em tom rosé.',
    image: { src: img('jogo-banheiro-rose'), alt: 'Dispenser e difusor em resina com pedras rosé sobre bandeja orgânica', width: 656, height: 880 },
  },
  {
    name: 'Difusor Rosé',
    category: 'Decoração',
    description: 'Pedras em tom rosé, aro dourado e varetas naturais.',
    image: { src: img('difusor-bandeja-rose'), alt: 'Difusor em resina com pedras rosé ao lado de flores', width: 604, height: 880 },
  },
]
