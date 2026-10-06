import { useCatalogSelection } from './catalogSelectionContext'
import type { CatalogProduct } from './catalogTypes'
import CatalogImage from './CatalogImage'

export default function SelectionItem({ product }: { product: CatalogProduct }) {
  const { remove } = useCatalogSelection()
  return (
    <li className="ts-selection-item">
      <div className="ts-selection-thumbnail"><CatalogImage image={product.image} /></div>
      <div className="ts-selection-item-copy">
        <h3>{product.name}</h3>
        {product.category && <p className="ts-selection-category">{product.category}</p>}
        <div className="ts-selection-item-actions">
          <button className="ts-selection-remove" type="button" onClick={() => remove(product.id)} aria-label={`Remover ${product.name}`}>Remover</button>
        </div>
      </div>
    </li>
  )
}
