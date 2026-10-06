import { useRef, useState } from 'react'
import { useCatalogSelection } from './catalogSelectionContext'
import LeafIcon from './LeafIcon'
import SelectionDrawer from './SelectionDrawer'

export default function SelectionLeafButton() {
  const { selectedCount } = useCatalogSelection()
  const [open, setOpen] = useState(false)
  const leafRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button
        ref={leafRef}
        type="button"
        className={`ts-selection-leaf${open ? ' is-open' : ''}`}
        aria-label="Abrir minha seleção"
        aria-expanded={open}
        aria-controls="catalog-selection-panel"
        aria-haspopup="dialog"
        aria-describedby="catalog-selection-count"
        onClick={() => setOpen(true)}
      >
        <LeafIcon />
        {selectedCount > 0 && <span key={selectedCount} className="ts-selection-badge" aria-hidden="true">{selectedCount}</span>}
        <span id="catalog-selection-count" className="ts-sr-only">{selectedCount} {selectedCount === 1 ? 'peça selecionada' : 'peças selecionadas'}</span>
      </button>
      <SelectionDrawer open={open} onClose={() => setOpen(false)} leafRef={leafRef} />
    </>
  )
}
