export function parseFixedPrice(value: string): number | null {
  const normalized = value.trim()
  const price = Number(normalized.replace(',', '.'))
  return /^\d+(?:[.,]\d{1,2})?$/.test(normalized)
    && Number.isFinite(price) && price > 0 && price <= 999999.99 ? price : null
}

export function formatProductPrice(price: number | null): string {
  return price == null ? 'Sob orçamento' : price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
