import { useState } from 'react'
import type { CatalogProduct } from './catalogTypes'
import LeafIcon from './LeafIcon'

export default function CatalogImage({ image, eager = false }: { image: CatalogProduct['image']; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <span className="ts-catalog-image-fallback" role="img" aria-label={`${image.alt}. Imagem indisponível.`}>
      <LeafIcon />
      <span>Imagem indisponível</span>
    </span>
  ) : (
    <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
  )
}
