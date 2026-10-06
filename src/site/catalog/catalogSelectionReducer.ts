import type { CatalogSelectionDraft } from './catalogTypes'
import { emptySelection } from './catalogStorage.ts'

export type SelectionAction =
  | { type: 'hydrate'; selection: CatalogSelectionDraft }
  | { type: 'add' | 'remove'; productId: string }
  | { type: 'story'; story: string }
  | { type: 'clear' }

export function selectionReducer(selection: CatalogSelectionDraft, action: SelectionAction): CatalogSelectionDraft {
  if (action.type === 'hydrate') return action.selection
  if (action.type === 'clear') return emptySelection()
  if (action.type === 'story') return { ...selection, story: action.story }
  if (action.type === 'remove') return { ...selection, selectedProductIds: selection.selectedProductIds.filter((id) => id !== action.productId) }
  if (selection.selectedProductIds.includes(action.productId)) return selection
  return { ...selection, selectedProductIds: [...selection.selectedProductIds, action.productId] }
}
