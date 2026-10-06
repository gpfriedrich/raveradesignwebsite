import { createContext, useContext } from 'react'

export type CatalogSelection = {
  selectedProductIds: string[]
  story: string
  selectedCount: number
  ready: boolean
  storageAvailable: boolean
  announcement: { message: string; version: number }
  add: (productId: string) => void
  setStory: (story: string) => void
  remove: (productId: string) => void
  clear: () => void
}

export const CatalogSelectionContext = createContext<CatalogSelection | null>(null)

export function useCatalogSelection() {
  const context = useContext(CatalogSelectionContext)
  if (!context) throw new Error('A seleção precisa estar dentro do catálogo.')
  return context
}
