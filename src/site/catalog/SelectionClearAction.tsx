import { useLayoutEffect, useRef, useState } from 'react'
import { useCatalogSelection } from './catalogSelectionContext'

export default function SelectionClearAction() {
  const { clear } = useCatalogSelection()
  const [confirming, setConfirming] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const wasConfirming = useRef(false)

  useLayoutEffect(() => {
    if (confirming) confirmRef.current?.focus()
    else if (wasConfirming.current) triggerRef.current?.focus()
    wasConfirming.current = confirming
  }, [confirming])

  return (
    <div className="ts-selection-reset">
      <button ref={triggerRef} className="ts-selection-clear" type="button" onClick={() => setConfirming(true)} aria-expanded={confirming} aria-controls="selection-clear-confirmation">Limpar seleção</button>
      {confirming && (
        <div id="selection-clear-confirmation" className="ts-selection-confirmation" role="group" aria-labelledby="selection-clear-question">
          <p id="selection-clear-question">Limpar as peças e a história?</p>
          <div>
            <button ref={confirmRef} className="ts-button ts-button--wine" type="button" onClick={clear}>Sim, limpar</button>
            <button className="ts-selection-clear" type="button" onClick={() => setConfirming(false)}>Manter seleção</button>
          </div>
        </div>
      )}
    </div>
  )
}
