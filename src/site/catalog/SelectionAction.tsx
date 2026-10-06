import { useCatalogSelection } from './catalogSelectionContext'
import type { CatalogProduct } from './catalogTypes'

export default function SelectionAction({ product }: { product: CatalogProduct }) {
  const { selectedProductIds, add, remove, ready } = useCatalogSelection()
  const selected = selectedProductIds.includes(product.id)
  const hintId = `selection-hint-${product.id}`

  return (
    <div className="ts-selection-action">
      <button
        type="button"
        className={`ts-button ts-button--wine${selected ? ' is-selected' : ''}`}
        disabled={!ready}
        onClick={() => selected ? remove(product.id) : add(product.id)}
        aria-label={`${selected ? 'Selecionado' : 'Adicionar à seleção'}: ${product.name}`}
        aria-pressed={selected}
        aria-describedby={selected ? hintId : undefined}
      >
        {selected ? 'Selecionado' : 'Adicionar à seleção'}<span aria-hidden="true">{selected ? '✓' : '+'}</span>
      </button>
      <span id={hintId} className="ts-selection-action-hint">{selected ? 'Ative novamente para remover da seleção.' : '\u00a0'}</span>
    </div>
  )
}
