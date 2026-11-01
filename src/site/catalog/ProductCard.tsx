import { useState, useEffect } from 'react'
import type { CatalogProduct } from './catalogTypes'
import { productHref } from './catalogRoutes'
import CatalogImage from './CatalogImage'
import SelectionAction from './SelectionAction'
import { useCatalogSelection } from './catalogSelectionContext'

export default function ProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  const { selectedProductIds } = useCatalogSelection()
  const [imageIndex, setImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!product.images || product.images.length <= 1) return

    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setImageIndex(prev => (prev + 1) % product.images.length)
        setIsTransitioning(false)
      }, 500)
    }, 3000)

    return () => clearInterval(timer)
  }, [product])

  return (
    <article className={`ts-catalog-card${selectedProductIds.includes(product.id) ? ' is-selected' : ''}`} aria-labelledby={`product-${product.id}`}>
      <a className="ts-catalog-card-image" href={productHref(product.id)} aria-label={`Ver ${product.name}`}>
        <div style={{
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.5s ease'
        }}>
          {product.images && product.images.length > 0 ? (
            <CatalogImage image={product.images[imageIndex]} eager={index < 2} />
          ) : (
            <div className="ts-catalog-image-fallback"><span>Imagem indisponível</span></div>
          )}
        </div>
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
