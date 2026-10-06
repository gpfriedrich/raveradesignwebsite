import type { CatalogProduct } from './catalogTypes'

export function buildQuoteMessage(products: readonly Pick<CatalogProduct, 'name'>[], story: string): string {
  if (!products.length) return ''
  const message = [
    'Olá! Gostei das seguintes peças da RAVERA:',
    products.map((product) => `• ${product.name}`).join('\n'),
    'Gostaria de solicitar um orçamento personalizado baseado nessas peças.',
  ].join('\n\n')
  const meaningfulStory = story.trim()
  return meaningfulStory ? `${message}\n\nMinha história:\n${meaningfulStory}` : message
}
