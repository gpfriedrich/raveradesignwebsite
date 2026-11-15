import { useEffect, useRef, useState } from 'react'
import { pieces } from './content'

export default function PiecesCarousel() {
  const trackRef = useRef<HTMLUListElement>(null)
  const [position, setPosition] = useState({ first: 0, last: 0, atStart: true, atEnd: false })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => {
      const bounds = track.getBoundingClientRect()
      const visible = Array.from(track.children).flatMap((child, index) => {
        const rect = child.getBoundingClientRect()
        return rect.left >= bounds.left - 2 && rect.right <= bounds.right + 2 ? [index] : []
      })
      setPosition({
        first: visible[0] ?? 0,
        last: visible.at(-1) ?? 0,
        atStart: track.scrollLeft <= 2,
        atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
      })
    }
    const observer = new ResizeObserver(update)
    observer.observe(track)
    track.addEventListener('scroll', update, { passive: true })
    update()
    return () => { observer.disconnect(); track.removeEventListener('scroll', update) }
  }, [])

  const move = (direction: number) => {
    const track = trackRef.current
    if (!track) return
    const cards = Array.from(track.children) as HTMLElement[]
    const target = direction > 0
      ? cards.find((card) => card.offsetLeft > track.scrollLeft + 2)
      : cards.findLast((card) => card.offsetLeft < track.scrollLeft - 2)
    if (target) track.scrollTo({
      left: target.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  if (!pieces.length) return null

  return (
    <div className="ts-pieces-carousel" role="region" aria-roledescription="carrossel" aria-labelledby="ts-pieces-title">
      <ul
        id="ts-pieces-track"
        className="ts-pieces-track"
        ref={trackRef}
        tabIndex={0}
        aria-label="Peças do ateliê. Use as setas para navegar."
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            move(event.key === 'ArrowRight' ? 1 : -1)
          }
          if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault()
            event.currentTarget.scrollTo({ left: event.key === 'Home' ? 0 : event.currentTarget.scrollWidth })
          }
        }}
      >
        {pieces.map((piece) => (
          <li key={piece.name} className="ts-piece">
            <div className="ts-piece-image">
              <img src={piece.image.src} alt={piece.image.alt} width={piece.image.width} height={piece.image.height} loading="lazy" decoding="async" />
            </div>
            <p className="ts-piece-category">{piece.category}</p>
            <h3>{piece.name}</h3>
            <p className="ts-piece-description">{piece.description}</p>
          </li>
        ))}
      </ul>
      <div className="ts-pieces-controls">
        <p aria-live="polite" aria-atomic="true">
          {position.first === position.last ? `Peça ${position.first + 1}` : `Peças ${position.first + 1}–${position.last + 1}`} de {pieces.length}
        </p>
        <div className="ts-pieces-buttons">
          <button type="button" aria-label="Peça anterior" aria-controls="ts-pieces-track" disabled={position.atStart} onClick={() => move(-1)}>←</button>
          <button type="button" aria-label="Próxima peça" aria-controls="ts-pieces-track" disabled={position.atEnd} onClick={() => move(1)}>→</button>
        </div>
      </div>
    </div>
  )
}
