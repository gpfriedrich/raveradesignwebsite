import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

test('dynamic catalog renders loading on the server, with safe empty selection and optional card metadata absent', async () => {
  const server = await createServer({ cacheDir: 'node_modules/.vite-ssr-test', server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom' })
  try {
    const { parseFixedPrice, formatProductPrice } = await server.ssrLoadModule('/src/site/catalog/productPricing.ts')
    assert.equal(parseFixedPrice('125,90'), 125.9)
    assert.equal(parseFixedPrice(' 125.90 '), 125.9)
    for (const invalid of ['', '0', '-1', '1000000', '1,234', 'abc', 'Infinity']) {
      assert.equal(parseFixedPrice(invalid), null, `Invalid fixed price: ${invalid}`)
    }
    assert.equal(formatProductPrice(null), 'Sob orçamento')
    assert.match(formatProductPrice(125.9), /R\$\s+125,90/)
    const { mapDbToCatalog, mapCatalogToDb } = await server.ssrLoadModule('/src/site/catalog/catalogService.ts')
    for (const price of [null, 125.9]) {
      const stored = { id: 'pricing-test', name: 'Peça', images: [], price }
      assert.equal(mapDbToCatalog(stored).price, price)
      assert.equal(mapCatalogToDb(mapDbToCatalog(stored)).price, price)
    }
    const { default: CatalogPage } = await server.ssrLoadModule('/src/site/catalog/CatalogPage.tsx')
    const { catalogProducts } = await server.ssrLoadModule('/src/site/catalog/catalogData.ts')
    const { default: ProductCard } = await server.ssrLoadModule('/src/site/catalog/ProductCard.tsx')
    const { default: Provider } = await server.ssrLoadModule('/src/site/catalog/CatalogSelectionProvider.tsx')
    const { default: SelectionLeafButton } = await server.ssrLoadModule('/src/site/catalog/SelectionLeafButton.tsx')
    const { default: LandingThree } = await server.ssrLoadModule('/src/site/landing3/LandingThree.tsx')
    globalThis.window = { get sessionStorage() { throw new Error('Storage must never be read during render') } }

    const html = renderToString(createElement(CatalogPage))
    assert.ok(html.includes('Carregando catálogo...'))
    assert.ok(!html.includes('Memória em Flor'))

    const selection = renderToString(createElement(Provider, null, createElement(SelectionLeafButton)))
    assert.ok(selection.includes('Minha seleção'))
    assert.ok(!selection.includes('ts-selection-badge'))
    assert.ok(selection.includes('disabled=""'))
    assert.ok(selection.includes('Conte sua história'))
    assert.ok(selection.includes('Solicitar orçamento pelo Instagram'))
    assert.ok(selection.includes('Selecione pelo menos uma peça para enviar sua solicitação.'))
    assert.ok(!selection.includes('quote-message-text'))
    assert.ok(!/R\$|Unidades selecionadas|ts-selection-quantity|Adicionar outra/.test(selection))

    const home = renderToString(createElement(LandingThree))
    assert.ok(home.includes('id="catalogo"'))
    assert.ok(!/Monte seu pedido|id="encomenda"|#encomenda|ts-form|ts-order|ts-piece-price/.test(home))

    const { default: SelectionItem } = await server.ssrLoadModule('/src/site/catalog/SelectionItem.tsx')
    const { CatalogSelectionContext } = await server.ssrLoadModule('/src/site/catalog/catalogSelectionContext.ts')
    const { selectionReducer } = await server.ssrLoadModule('/src/site/catalog/catalogSelectionReducer.ts')
    const piece = { ...catalogProducts[0], category: 'Decoração', price: null }
    const selected = selectionReducer({ selectedProductIds: [], story: '' }, { type: 'add', productId: piece.id })
    assert.deepEqual(selected.selectedProductIds, [piece.id])
    const selectionContext = { ...selected, remove() {} }
    const renderSelected = (product) => renderToString(createElement(CatalogSelectionContext.Provider,
      { value: selectionContext }, createElement(SelectionItem, { product })))
    const selectedHtml = renderSelected(piece)
    assert.ok(selectedHtml.includes(piece.name))
    assert.ok(selectedHtml.includes(piece.images[0].src))
    assert.ok(selectedHtml.includes('Decoração'))
    assert.ok(renderSelected({ ...piece, images: [] }).includes('Imagem indisponível'))
    assert.ok(renderSelected(piece).includes(piece.name), 'Selection remains renderable after another render')
    assert.equal(mapDbToCatalog(mapCatalogToDb(piece)).category, 'Decoração')

    const minimal = { id: catalogProducts[0].id, name: catalogProducts[0].name, images: catalogProducts[0].images }
    const card = renderToString(createElement(Provider, null, createElement(ProductCard, { product: minimal, index: 0 })))
    assert.ok(card.includes(minimal.name))
    assert.ok(!card.includes('undefined'))
    assert.ok(!card.includes('ts-catalog-price'))

    const missing = renderToString(createElement(CatalogPage, { productSlug: 'removed-product' }))
    assert.ok(missing.includes('Carregando catálogo...'))
    assert.ok(!missing.includes('Peça não encontrada.'))
  } finally {
    delete globalThis.window
    await server.close()
  }
})

test('homepage and catalog remain usable without Supabase configuration', async () => {
  const server = await createServer({
    cacheDir: 'node_modules/.vite-no-config-test',
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(''),
    },
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
  })
  try {
    const service = await server.ssrLoadModule('/src/site/catalog/catalogService.ts')
    assert.deepEqual(await service.fetchProducts(), [])
    assert.deepEqual(await service.fetchAllProducts(), [])
    assert.equal(await service.fetchProductById('missing'), null)
    assert.ok((await service.upsertProduct({ id: 'test' })).error)
    assert.ok((await service.deleteProduct('test')).error)
    const { default: LandingThree } = await server.ssrLoadModule('/src/site/landing3/LandingThree.tsx')
    const html = renderToString(createElement(LandingThree))
    assert.ok(html.includes('ts-hero-title'))
    assert.ok(html.includes('Fragmentos de história,'))
    assert.ok(html.includes('id="colecao"'))
  } finally {
    await server.close()
  }
})
