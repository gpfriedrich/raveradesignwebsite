import { useState } from 'react'
import { quotationContact } from '../shared/contact'
import { catalogById } from './catalogData'
import { buildQuoteMessage } from './catalogQuote'
import { useCatalogSelection } from './catalogSelectionContext'

export default function useCatalogQuote() {
  const { selectedProductIds, story, ready } = useCatalogSelection()
  const products = selectedProductIds.flatMap((id) => {
    const product = catalogById.get(id)
    return product ? [product] : []
  })
  const message = buildQuoteMessage(products, story)
  const contact = quotationContact(message)
  const enabled = ready && products.length > 0
  const [showMessage, setShowMessage] = useState(false)
  const [copyStatus, setCopyStatus] = useState<{ message: string; copied: boolean; version: number } | null>(null)

  async function copyMessage() {
    if (!enabled) return
    let copied = false
    try {
      await navigator.clipboard.writeText(message)
      copied = true
    } catch {
      // A mensagem continua disponível para seleção e cópia manual.
    }
    setCopyStatus((previous) => ({ message, copied, version: (previous?.version ?? 0) + 1 }))
  }

  function requestQuote() {
    if (!enabled) return
    setShowMessage(true)
    // O Instagram não aceita mensagem pré-preenchida. Iniciar a cópia antes
    // de abrir a conversa conserva a ativação necessária para a Clipboard API.
    if (!contact.prefilled) void copyMessage()
    try {
      window.open(contact.href, '_blank', 'noopener,noreferrer')
    } catch {
      // O link explícito e a mensagem permitem continuar se a abertura falhar.
    }
  }

  return { message, contact, enabled, showMessage, copyMessage, requestQuote, copyStatus: copyStatus?.message === message ? copyStatus : null }
}
