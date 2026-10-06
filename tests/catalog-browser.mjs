import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const modulePath = process.env.RAVERA_PLAYWRIGHT_PATH
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright')
const baseURL = process.env.RAVERA_BASE_URL ?? 'http://127.0.0.1:5173'
const output = process.env.RAVERA_QA_OUTPUT ?? join(tmpdir(), 'ravera-catalog-qa')
const key = 'ravera:catalog-selection:v2'
const legacyKey = 'ravera:catalog-selection:v1'
const catalog = '/prototipos/catalogo/'
const ids = ['memoria-em-flor', 'curva-da-materia', 'geometria-quieta', 'relicario-de-mesa', 'essencia-ravera']
const names = ['Memória em Flor', 'Curva da Matéria', 'Geometria Quieta', 'Relicário de Mesa', 'Essência Ravera']
const story = '  As flores do meu casamento.\n\nUma lembrança para minha mãe: coração & afeto 🌿.  '
const empty = { selectedProductIds: [], story: '' }
const checks = []
const errors = []
const externalFailures = []
await mkdir(output, { recursive: true })

const browser = await chromium.launch({
  ...(process.env.RAVERA_BROWSER_PATH ? { executablePath: process.env.RAVERA_BROWSER_PATH } : {}),
  headless: true,
})
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })

function monitor(page) {
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (!['error', 'warning'].includes(message.type())) return
    if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(message.location().url)) externalFailures.push(message.text())
    else errors.push(`${message.type()}: ${message.text()}`)
  })
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(baseURL) && request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(`Request failed: ${request.url()}`)
    else if (!request.url().startsWith(baseURL)) externalFailures.push(`${request.url()}: ${request.failure()?.errorText}`)
  })
}

// Exercise the real generated message without contacting the brand or sending it.
async function mockContact(page) {
  await page.addInitScript(() => {
    window.__opened = []
    window.__copied = []
    window.open = (...args) => { window.__opened.push(args); return null }
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (text) => { window.__copied.push(text) },
    } })
  })
}

async function go(page, path, selector = '.ts-selection-leaf') {
  await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
  await page.locator(selector).waitFor({ state: 'visible' })
}

async function stored(page) {
  return page.evaluate((storageKey) => sessionStorage.getItem(storageKey), key)
}

async function draft(page, expected) {
  await page.waitForFunction(({ storageKey, value }) => {
    return JSON.stringify(JSON.parse(sessionStorage.getItem(storageKey))) === JSON.stringify(value)
  }, { storageKey: key, value: expected })
}

async function badge(page, count) {
  await page.waitForFunction((expected) => {
    const node = document.querySelector('.ts-selection-badge')
    return expected ? node?.textContent === String(expected) : !node
  }, count)
}

async function noOverflow(page, label) {
  const sizes = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }))
  assert.ok(sizes.scroll <= sizes.width, `${label}: horizontal overflow ${JSON.stringify(sizes)}`)
}

async function noCommerce(page) {
  assert.equal(await page.locator('.ts-catalog-price, .ts-selection-quantity, .ts-piece-price').count(), 0)
  assert.doesNotMatch(await page.locator('.ts-catalog').ariaSnapshot(), /R\$|Aumentar quantidade|Diminuir quantidade|Adicionar outra|Subtotal|Preço|Valor da peça/i)
  assert.doesNotMatch(await page.locator('.ts-catalog main').innerText(), /R\$|Subtotal|Preço promocional/i)
}

async function loadImages(page, selector = 'main img') {
  const position = await page.evaluate(() => scrollY)
  for (const img of await page.locator(selector).all()) {
    await img.scrollIntoViewIfNeeded()
    await img.evaluate((element) => element.decode().catch(() => {}))
  }
  await page.evaluate((scrollPosition) => scrollTo(0, scrollPosition), position)
}

async function dialog(page, open = true) {
  if (open) await page.getByRole('button', { name: 'Abrir minha seleção', exact: true }).click()
  await page.locator('dialog').waitFor({ state: open ? 'visible' : 'hidden' })
}

const add = (page, index) => page.getByRole('button', { name: `Adicionar à seleção: ${names[index]}`, exact: true })
const selected = (page, index) => page.getByRole('button', { name: `Selecionado: ${names[index]}`, exact: true })
const storyField = (page) => page.getByLabel('Conte sua história Opcional', { exact: true })
const quoteButton = (page) => page.getByRole('button', { name: 'Solicitar orçamento', exact: false })
const closeButton = (page) => page.getByRole('button', { name: 'Fechar minha seleção', exact: true })
const messageFor = (indexes, text = '') => `Olá! Gostei das seguintes peças da RAVERA:\n\n${indexes.map((index) => `• ${names[index]}`).join('\n')}\n\nGostaria de solicitar um orçamento personalizado baseado nessas peças.${text.trim() ? `\n\nMinha história:\n${text.trim()}` : ''}`

async function seed(page, value, storageKey = key) {
  await page.evaluate(({ target, data }) => {
    sessionStorage.clear()
    sessionStorage.setItem(target, typeof data === 'string' ? data : JSON.stringify(data))
  }, { target: storageKey, data: value })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.locator('.ts-selection-leaf').waitFor()
}

let page = await context.newPage()
monitor(page)
await mockContact(page)

try {
  await go(page, '/', '#catalogo')
  if (process.env.RAVERA_REQUIRE_WEBFONTS === '1') {
    assert.equal(await page.evaluate(async () => {
      await Promise.all([document.fonts.load('500 32px "Cormorant Garamond"'), document.fonts.load('400 16px "Jost"')])
      return document.fonts.check('500 32px "Cormorant Garamond"') && document.fonts.check('400 16px "Jost"')
    }), true, 'Official web fonts failed to load')
  }
  assert.equal(await page.locator('.ts-hero').count(), 1)
  assert.equal(await page.locator('#eternizacao, .ts-eternal, #encomenda, .ts-order, .ts-form, a[href*="#encomenda"], a[href="#eternizacao"]').count(), 0)
  assert.doesNotMatch(await page.locator('main').innerText(), /Monte seu pedido/)
  assert.equal(await page.locator('.ts-selection-leaf, #catalog-story').count(), 0)
  assert.equal(await page.locator('#origem + #catalogo + #colecao').count(), 1)
  assert.equal(await page.locator('main > section:last-child').getAttribute('id'), 'pecas')
  assert.equal(await page.locator('header a[href*="landing1"], header a[href*="landing2"], footer a[href*="landing1"], footer a[href*="landing2"]').count(), 0)
  await page.getByRole('link', { name: 'Ver catálogo completo' }).click()
  await page.locator('.ts-selection-leaf').waitFor()
  assert.equal(new URL(page.url()).pathname, catalog)
  assert.equal(await page.locator('.ts-catalog-card').count(), 5)
  assert.equal(await page.getByText('Lorem ipsum', { exact: false }).count(), 0)
  await noCommerce(page)
  checks.push('Landing 3 remains home; both removed sections and anchors absent; homepage catalog and existing route preserved')

  await dialog(page)
  assert.equal(await page.getByRole('heading', { name: 'Minha seleção', exact: true }).count(), 1)
  assert.equal(await page.getByRole('heading', { name: 'Sua seleção está vazia.', exact: true }).count(), 1)
  assert.equal(await quoteButton(page).isDisabled(), true)
  assert.equal(await storyField(page).getAttribute('required'), null)
  assert.equal(await storyField(page).getAttribute('maxlength'), null)
  await storyField(page).fill(story)
  await draft(page, { ...empty, story })
  assert.equal(await quoteButton(page).isDisabled(), true, 'Story alone must not enable quotation')
  await quoteButton(page).evaluate((element) => element.click())
  assert.deepEqual(await page.evaluate(() => window.__opened), [])
  assert.equal(await page.getByText('Selecione pelo menos uma peça para solicitar um orçamento.', { exact: true }).isVisible(), true)
  await page.keyboard.press('Escape')
  await dialog(page, false)
  checks.push('Empty state, accessible optional multiline story, unlimited input and disabled quotation without real products')

  await add(page, 0).click()
  await badge(page, 1)
  assert.equal(await selected(page, 0).getAttribute('aria-pressed'), 'true')
  assert.match(await page.locator('.ts-catalog-card').first().getAttribute('class'), /is-selected/)
  await selected(page, 0).click()
  await badge(page, 0)
  assert.equal(await add(page, 0).getAttribute('aria-pressed'), 'false')
  await add(page, 0).click()
  await add(page, 1).click()
  await badge(page, 2)
  await draft(page, { selectedProductIds: ids.slice(0, 2), story })
  assert.equal(await page.getByRole('status').filter({ hasText: 'Curva da Matéria adicionada à seleção.' }).count(), 1)
  await dialog(page)
  assert.equal(await page.locator('.ts-selection-item').count(), 2)
  assert.equal(await page.locator('.ts-selection-summary strong').textContent(), '2')
  assert.equal(await page.locator('.ts-selection-leaf').getAttribute('aria-expanded'), 'true')
  assert.equal(await storyField(page).inputValue(), story)
  assert.equal(await quoteButton(page).isEnabled(), true)
  await noCommerce(page)
  checks.push('Unique product toggle, selected semantics, distinct badge, shared state, live announcements and no quantity or price UI')

  assert.equal(await closeButton(page).evaluate((element) => document.activeElement === element), true)
  await page.keyboard.press('Shift+Tab')
  assert.equal(await quoteButton(page).evaluate((element) => document.activeElement === element), true)
  await page.keyboard.press('Tab')
  assert.equal(await closeButton(page).evaluate((element) => document.activeElement === element), true)
  await storyField(page).focus()
  assert.equal(await storyField(page).evaluate((element) => document.activeElement === element), true)
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden')
  await page.keyboard.press('Escape')
  await dialog(page, false)
  assert.equal(await page.locator('.ts-selection-leaf').evaluate((element) => document.activeElement === element), true)
  assert.equal(await page.evaluate(() => document.body.style.overflow), '')
  await page.reload({ waitUntil: 'domcontentloaded' })
  await badge(page, 2)
  await page.locator('.ts-selection-leaf').focus()
  await page.keyboard.press('Enter')
  await page.locator('dialog').waitFor({ state: 'visible' })
  assert.equal(await storyField(page).inputValue(), story)
  await page.mouse.click(100, 400)
  await dialog(page, false)
  checks.push('Reload restores IDs and exact story; keyboard opening, focus trap, Escape, backdrop, focus return and body scroll lock')

  const beforeNavigation = await stored(page)
  for (const [path, selector] of [['/', '#catalogo'], ['/prototipos/landing1/', '.rv-one'], ['/prototipos/landing2/', '.rv-two']]) {
    await go(page, path, selector)
    assert.equal(await page.locator('.ts-selection-leaf, dialog.ts-selection-drawer').count(), 0)
    assert.equal(await stored(page), beforeNavigation)
  }
  await go(page, `${catalog}?origem=teste`)
  await badge(page, 2)
  await page.getByRole('link', { name: `Ver ${names[0]}`, exact: true }).click()
  await page.locator('#ts-product-title').waitFor()
  assert.equal(await page.locator('#ts-product-title').textContent(), names[0])
  await badge(page, 2)
  assert.equal(await selected(page, 0).getAttribute('aria-pressed'), 'true')
  await noCommerce(page)
  await dialog(page)
  await page.getByRole('button', { name: `Remover ${names[0]}`, exact: true }).click()
  await badge(page, 1)
  await draft(page, { selectedProductIds: [ids[1]], story })
  assert.equal(await page.locator('dialog').getByRole('status').filter({ hasText: `${names[0]} removida da seleção.` }).count(), 1)
  await page.keyboard.press('Escape')
  assert.equal(await add(page, 0).isEnabled(), true)
  checks.push('Navigation hides leaf outside catalog without changing data; detail state shared; removal preserves story and other pieces')

  await go(page, catalog)
  await add(page, 0).click()
  await dialog(page)
  await storyField(page).fill('')
  await quoteButton(page).click()
  await page.getByLabel('Texto da mensagem do orçamento', { exact: true }).waitFor()
  assert.equal(await page.getByLabel('Texto da mensagem do orçamento').inputValue(), messageFor([1, 0]))
  assert.deepEqual(await page.evaluate(() => window.__opened.at(-1)), ['https://ig.me/m/ravera.designn', '_blank', 'noopener,noreferrer'])
  assert.equal(await page.evaluate(() => window.__copied.at(-1)), messageFor([1, 0]))
  await storyField(page).fill(' \n \t ')
  await quoteButton(page).click()
  assert.equal(await page.evaluate(() => window.__copied.at(-1)), messageFor([1, 0]))
  await storyField(page).fill(story)
  await quoteButton(page).click()
  await draft(page, { selectedProductIds: [ids[1], ids[0]], story })
  assert.equal(await page.evaluate(() => window.__copied.at(-1)), messageFor([1, 0], story))
  assert.equal(await page.getByLabel('Texto da mensagem do orçamento').inputValue(), messageFor([1, 0], story))
  assert.doesNotMatch(await page.getByLabel('Texto da mensagem do orçamento').inputValue(), /R\$|memoria-em-flor|curva-da-materia|\.webp|Quantidade/i)
  await page.getByRole('button', { name: 'Copiar mensagem', exact: true }).click()
  assert.equal(await page.evaluate(() => window.__copied.at(-1)), messageFor([1, 0], story))
  const contactLink = page.getByRole('link', { name: 'Abrir conversa no Instagram', exact: false })
  assert.equal(await contactLink.getAttribute('href'), 'https://ig.me/m/ravera.designn')
  assert.equal(await contactLink.getAttribute('rel'), 'noopener noreferrer')
  assert.equal(await contactLink.getAttribute('target'), '_blank')
  assert.equal(await page.getByRole('status').filter({ hasText: 'Mensagem copiada. Cole na conversa do Instagram.' }).count(), 1)
  await page.screenshot({ path: join(output, 'quotation-1440.png') })
  await page.keyboard.press('Escape')
  await draft(page, { selectedProductIds: [ids[1], ids[0]], story })
  checks.push('Exact Portuguese quote with real names, whitespace omitted, multiline story preserved, official Instagram copy/DM flow and resend without clearing')

  await dialog(page)
  await page.getByRole('button', { name: 'Limpar seleção', exact: true }).click()
  await page.getByRole('button', { name: 'Manter seleção', exact: true }).click()
  await draft(page, { selectedProductIds: [ids[1], ids[0]], story })
  await page.getByRole('button', { name: 'Limpar seleção', exact: true }).click()
  await page.getByRole('button', { name: 'Sim, limpar', exact: true }).click()
  await badge(page, 0)
  await page.waitForFunction((storageKey) => sessionStorage.getItem(storageKey) === null, key)
  assert.equal(await storyField(page).inputValue(), '')
  assert.equal(await quoteButton(page).isDisabled(), true)
  assert.equal(await page.evaluate((storageKey) => sessionStorage.getItem(storageKey), legacyKey), null)
  assert.equal(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), true)
  await page.keyboard.press('Escape')
  checks.push('Lightweight clear confirmation can be cancelled; explicit clear removes IDs, story and both storage versions')

  await seed(page, [
    { productId: ids[0], quantity: 2 }, { productId: ids[0], quantity: 10 },
    { productId: ids[1], quantity: -2 }, { productId: ids[2], quantity: 'bad' },
    { productId: 'removed-product', quantity: 1 }, null,
  ], legacyKey)
  await badge(page, 3)
  await draft(page, { selectedProductIds: ids.slice(0, 3), story: '' })
  assert.equal(await page.evaluate((storageKey) => sessionStorage.getItem(storageKey), legacyKey), null)
  await seed(page, { selectedProductIds: [ids[0], ids[0], 'removed-product', 123, null], story })
  await badge(page, 1)
  await draft(page, { selectedProductIds: [ids[0]], story })
  await seed(page, '{broken')
  await badge(page, 0)
  await page.waitForFunction((storageKey) => sessionStorage.getItem(storageKey) === null, key)
  await seed(page, { selectedProductIds: [ids[0]], story: { invalid: true } })
  await draft(page, { selectedProductIds: [ids[0]], story: '' })
  checks.push('v1 safely migrates to unique valid IDs; v2 duplicates, obsolete IDs, malformed JSON and invalid story are repaired')

  for (const slug of ids) {
    await go(page, `${catalog}${slug}/?origem=teste`, '#ts-product-title')
    await badge(page, 1)
    await noCommerce(page)
  }
  await go(page, catalog.slice(0, -1))
  await badge(page, 1)
  await go(page, `${catalog}nao-existe/`)
  assert.equal(await page.getByRole('heading', { name: 'Peça não encontrada.', exact: true }).count(), 1)
  checks.push('All five detail routes, catalog root, queries, trailing slash variants and unknown product fallback')

  await go(page, catalog)
  await seed(page, { selectedProductIds: ids.slice(0, 3), story })
  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 640 ? 812 : 1000 })
    await go(page, '/', '#catalogo')
    await noOverflow(page, `Homepage ${width}`)
    await loadImages(page, '#catalogo img')
    await page.locator('#catalogo').scrollIntoViewIfNeeded()
    await page.locator('#catalogo').screenshot({ path: join(output, `home-catalog-${width}.png`), style: '.ts-header, .ts-skip { visibility: hidden !important; }' })
    await go(page, catalog)
    await noOverflow(page, `Catalog ${width}`)
    await loadImages(page)
    await page.screenshot({ path: join(output, `catalog-${width}.png`), fullPage: true })
    await dialog(page)
    await noOverflow(page, `Drawer ${width}`)
    const layout = await page.locator('dialog').evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, viewportWidth: innerWidth, viewportHeight: innerHeight }
    })
    assert.ok(layout.x >= 0 && layout.y >= 0 && layout.right <= layout.viewportWidth && layout.bottom <= layout.viewportHeight + 1, `Drawer exceeds viewport: ${JSON.stringify(layout)}`)
    for (const target of await page.locator('dialog button').all()) {
      const rect = await target.boundingBox()
      assert.ok(rect.height >= 44, `Touch target too short at ${width}`)
    }
    await storyField(page).scrollIntoViewIfNeeded()
    await page.screenshot({ path: join(output, `selection-story-${width}.png`) })
    if (width === 375 || width === 1440) {
      await quoteButton(page).click()
      await page.getByLabel('Texto da mensagem do orçamento').scrollIntoViewIfNeeded()
      await page.screenshot({ path: join(output, `quotation-${width}.png`) })
    }
    await page.keyboard.press('Escape')
    await go(page, `${catalog}${ids[0]}/`, '#ts-product-title')
    await noOverflow(page, `Product ${width}`)
  }
  checks.push('Home, catalog, detail and story/quote drawer at 320 / 375 / 430 / 768 / 1024 / 1440 px; 44 px controls; no horizontal overflow')

  await page.setViewportSize({ width: 375, height: 430 })
  await go(page, catalog)
  await dialog(page)
  assert.equal(await page.locator('dialog').evaluate((element) => getComputedStyle(element).animationName), 'none')
  assert.equal(await page.locator('.ts-selection-body').evaluate((element) => element.scrollHeight > element.clientHeight), true)
  await storyField(page).focus()
  await page.evaluate(() => {
    Object.defineProperty(visualViewport, 'height', { configurable: true, value: 340 })
    Object.defineProperty(visualViewport, 'offsetTop', { configurable: true, value: 10 })
    visualViewport.dispatchEvent(new Event('resize'))
  })
  const keyboardLayout = await page.locator('dialog').boundingBox()
  assert.ok(keyboardLayout.y === 10 && keyboardLayout.height <= 340)
  const textareaBox = await storyField(page).boundingBox()
  const footerBox = await page.locator('.ts-selection-footer').boundingBox()
  assert.ok(textareaBox.y >= 0 && textareaBox.y < footerBox.y, 'Story must be reachable above fixed actions')
  assert.ok(footerBox.y + footerBox.height <= 351, 'Quote action exceeds simulated visible keyboard viewport')
  await page.screenshot({ path: join(output, 'selection-keyboard-375.png') })
  assert.equal(await closeButton(page).isVisible(), true)
  assert.equal(await quoteButton(page).isVisible(), true)
  await storyField(page).focus()
  await page.keyboard.press('Tab')
  assert.equal(await page.getByRole('button', { name: 'Limpar seleção', exact: true }).evaluate((element) => document.activeElement === element), true)
  await page.keyboard.press('Enter')
  const confirmButton = page.getByRole('button', { name: 'Sim, limpar', exact: true })
  assert.equal(await confirmButton.evaluate((element) => document.activeElement === element), true)
  const confirmBox = await confirmButton.boundingBox()
  const bodyBox = await page.locator('.ts-selection-body').boundingBox()
  assert.ok(confirmBox.y >= bodyBox.y && confirmBox.y + confirmBox.height <= bodyBox.y + bodyBox.height + 1, 'Keyboard confirmation must scroll into the visible content area')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  assert.equal(await page.getByRole('button', { name: 'Limpar seleção', exact: true }).evaluate((element) => document.activeElement === element), true)
  await draft(page, { selectedProductIds: ids.slice(0, 3), story })
  await page.keyboard.press('Escape')
  checks.push('Reduced motion, short mobile screen, independent content scroll and simulated keyboard visual viewport resizing')

  await page.evaluate(() => sessionStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await badge(page, 0)
  await dialog(page)
  assert.equal(await storyField(page).inputValue(), '')
  await page.keyboard.press('Escape')
  await add(page, 0).click()
  await badge(page, 1)
  checks.push('Clearing stored site data resets products and story after reload')

  const unavailable = await context.newPage()
  monitor(unavailable)
  await mockContact(unavailable)
  await unavailable.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Denied', 'SecurityError') } }))
  await go(unavailable, catalog)
  await add(unavailable, 0).click()
  await badge(unavailable, 1)
  await dialog(unavailable)
  await storyField(unavailable).fill(story)
  assert.equal(await unavailable.getByText('O armazenamento da sessão está indisponível.', { exact: false }).isVisible(), true)
  await unavailable.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new DOMException('Denied', 'NotAllowedError') } } })
    window.open = () => { throw new Error('Popup denied') }
  })
  await quoteButton(unavailable).click()
  assert.equal(await unavailable.getByLabel('Texto da mensagem do orçamento').inputValue(), messageFor([0], story))
  assert.equal(await unavailable.getByRole('link', { name: 'Abrir conversa no Instagram', exact: false }).isVisible(), true)
  await unavailable.getByRole('button', { name: 'Copiar mensagem', exact: true }).click()
  assert.equal(await unavailable.getByText('Copie a mensagem abaixo e cole na conversa do Instagram.', { exact: true }).isVisible(), true)
  await unavailable.close()
  checks.push('Unavailable storage remains usable in memory; denied clipboard and popup leave full message and explicit contact link available')

  const brokenImage = await context.newPage()
  const imageErrors = []
  brokenImage.on('pageerror', (error) => imageErrors.push(error.message))
  await brokenImage.route('**/ravera/landing3/jogo-banheiro-rose.webp', (route) => route.abort())
  await go(brokenImage, catalog)
  await brokenImage.locator('.ts-catalog-image-fallback').first().waitFor()
  assert.equal(await add(brokenImage, 0).isEnabled(), true)
  assert.deepEqual(imageErrors, [])
  await brokenImage.close()
  checks.push('Failed product image has accessible fallback and working selection control')

  await page.close()
  page = await context.newPage()
  monitor(page)
  await go(page, catalog)
  await badge(page, 0)
  assert.equal(await stored(page), null)
  assert.equal(await page.evaluate((storageKey) => localStorage.getItem(storageKey), key), null)
  checks.push('Closing selected tab and opening fresh tab starts empty session; no localStorage persistence')

  assert.deepEqual(errors, [], `Browser errors or warnings: ${JSON.stringify(errors)}`)
  const failures = [...new Set(externalFailures)]
  if (process.env.RAVERA_REQUIRE_WEBFONTS === '1') assert.deepEqual(failures, [], 'External resource failures')
  await writeFile(join(output, 'report.json'), JSON.stringify({ baseURL, checks, errors, externalFailures: failures, screenshots: output }, null, 2))
  console.log(JSON.stringify({ passed: checks.length, checks, errors, externalFailures: failures, screenshots: output }, null, 2))
} finally {
  await browser.close()
}
