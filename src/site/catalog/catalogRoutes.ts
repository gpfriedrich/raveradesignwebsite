export const CATALOG_PATH = '/prototipos/catalogo'

export function normalizePath(path: string) {
  return path.replace(/\/+$/, '') || '/'
}

export function isCatalogPath(path: string) {
  const normalized = normalizePath(path)
  return normalized === CATALOG_PATH || normalized.startsWith(`${CATALOG_PATH}/`)
}

export const productHref = (productId: string) => `${CATALOG_PATH}/${productId}/`
