import { CATALOG_PATH } from '../catalog/catalogRoutes'

export function siteLinks(home = false) {
  return [
    { href: home ? '#catalogo' : `${CATALOG_PATH}/`, label: 'Catálogo' },
    { href: `${home ? '' : '/'}#colecao`, label: 'Coleção' },
    { href: `${home ? '' : '/'}#pecas`, label: 'Peças' },
    { href: `${CATALOG_PATH}/`, label: 'Encomendas' },
  ]
}
