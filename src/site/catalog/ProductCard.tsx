import type { CatalogProduct } from './catalogTypes'
import { productHref } from './catalogRoutes'
import CatalogImage from './CatalogImage'
import SelectionAction from './SelectionAction'
import { useCatalogSelection } from './catalogSelectionContext'

export default function ProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  const { selectedProductIds } = useCatalogSelection()
  return (
    <article className={`ts-catalog-card${selectedProductIds.includes(product.id) ? ' is-selected' : ''}`} aria-labelledby={`product-${product.id}`}>
      <a className="ts-catalog-card-image" href={productHref(product.id)} aria-label={`Ver ${product.name}`}>
        <CatalogImage image={product.image} eager={index < 2} />
        <span className="ts-catalog-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </a>
      <div className="ts-catalog-card-copy">
        <h2 id={`product-${product.id}`}><a href={productHref(product.id)}>{product.name}</a></h2>
        {product.summary && <p className="ts-catalog-summary">{product.summary}</p>}
        <SelectionAction product={product} />
      </div>
    </article>
  )
}
