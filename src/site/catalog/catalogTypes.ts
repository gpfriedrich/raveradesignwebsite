export type CatalogProduct = {
  id: string
  name: string
  image: { src: string; alt: string; width: number; height: number }
  summary?: string
  category?: string
  material?: string
  size?: string
}

export type CatalogSelectionDraft = { selectedProductIds: string[]; story: string }
