# RAVERA — catálogo e orçamento personalizado

A Landing 3 permanece em `/`, com o alias `/landing3/`. A vitrine `#catalogo`, em `src/site/catalog/CatalogSection.tsx`, continua entre “A origem” e “Coleção”, na posição da antiga seção “Eternização”. A seção “Monte seu pedido” foi retirada integralmente do final da homepage, onde ficava em `#encomenda`, depois de `#pecas` e antes do rodapé. Os links de encomenda agora abrem o catálogo, e o espaçamento final foi ajustado.

O catálogo e os cinco detalhes mantêm `/prototipos/catalogo/` e `/prototipos/catalogo/<slug>/`. Logo, cabeçalho, navegação, rodapé, fontes, tokens, botões e animações são compartilhados com a Landing 3. A folha, a história opcional e o orçamento pertencem exclusivamente ao catálogo. Landing 1, Landing 2 e suas cópias históricas permanecem intactas.

## Arquivos desta atualização de orçamento

Criados:

- `src/site/shared/contact.ts`
- `src/site/catalog/catalogQuote.ts`
- `src/site/catalog/useCatalogQuote.ts`
- `src/site/catalog/SelectionClearAction.tsx`

Modificados:

- `src/site/landing3/LandingThree.tsx`
- `src/site/landing3/content.ts`
- `src/site/landing3/landing3.css`
- `src/site/shared/SiteHeader.tsx`
- `src/site/shared/SiteFooter.tsx`
- `src/site/shared/navigation.ts`
- `src/site/catalog/CatalogPage.tsx`
- `src/site/catalog/CatalogSelectionProvider.tsx`
- `src/site/catalog/ProductCard.tsx`
- `src/site/catalog/SelectionAction.tsx`
- `src/site/catalog/SelectionDrawer.tsx`
- `src/site/catalog/SelectionItem.tsx`
- `src/site/catalog/SelectionLeafButton.tsx`
- `src/site/catalog/catalogData.ts`
- `src/site/catalog/catalogTypes.ts`
- `src/site/catalog/catalogSelectionContext.ts`
- `src/site/catalog/catalogSelectionReducer.ts`
- `src/site/catalog/catalogStorage.ts`
- `src/site/catalog/catalog.css`
- `tests/catalog-state.test.mjs`
- `tests/catalog-render.test.mjs`
- `tests/catalog-browser.mjs`
- `README.md`
- `docs/catalog-implementation.md`

Nenhum arquivo removido. O formulário antigo, seus estados, validações, eventos, textos, estilos, passos e âncora foram removidos dos arquivos acima. Imagens usadas por conteúdo aprovado permanecem disponíveis.

## Arquivos da integração inicial do catálogo

Além dos arquivos acima, a primeira integração criou `CatalogSection.tsx`, `CatalogImage.tsx`, `LeafIcon.tsx` e `catalogRoutes.ts` em `src/site/catalog/`, e `RaveraLogo.tsx` e `useSectionReveal.ts` em `src/site/shared/`. Também criou os demais componentes, dados, estado, estilos e testes do catálogo que agora foram atualizados.

A primeira integração modificou `src/App.tsx`, `package.json` e as seis entradas HTML: `prototipos/catalogo/index.html`, `prototipos/catalogo/memoria-em-flor/index.html`, `prototipos/catalogo/curva-da-materia/index.html`, `prototipos/catalogo/geometria-quieta/index.html`, `prototipos/catalogo/relicario-de-mesa/index.html` e `prototipos/catalogo/essencia-ravera/index.html`. A rota existente passou a carregar o catálogo oficial, com títulos correspondentes e sem `noindex`; comandos de teste foram adicionados sem novas dependências. Esses arquivos não precisaram de alterações adicionais no fluxo de orçamento.

## Seleção e sessão

`sessionStorage` usa `ravera:catalog-selection:v2`:

```json
{
  "selectedProductIds": ["memoria-em-flor", "curva-da-materia"],
  "story": "Minha história opcional."
}
```

Cada ID existe no catálogo e aparece uma única vez. Adicionar novamente é uma operação idempotente; o botão “Selecionado” permite remover a peça. A folha conta produtos distintos. Não há preços, cálculos monetários ou controles de quantidade.

Após montar o cliente, a seleção é validada e restaurada. Recargas, navegação interna, desmontagem, fechamento do painel e abertura do contato preservam peças e história. Fora do catálogo, os controles não são montados. A aba tem sua própria sessão; encerrar a aba ou remover os dados armazenados elimina a seleção naturalmente. Remover uma peça preserva as outras e a história. “Limpar seleção”, com confirmação inline, remove tudo e as chaves de armazenamento.

O formato `ravera:catalog-selection:v1` é migrado extraindo os IDs válidos, descartando quantidades e duplicatas. A chave antiga só é retirada após salvar o novo formato. JSON corrompido, IDs inexistentes, histórias de tipo inválido, quota e armazenamento negado são tratados. Sem armazenamento, os controles funcionam em memória e o painel informa a limitação.

“Conte sua história” é opcional, aceita múltiplas linhas e não tem limite de caracteres. O texto bruto é preservado integralmente na sessão. Ao gerar a mensagem, espaços nas extremidades são retirados; linhas internas são mantidas. Texto contendo somente espaços não gera a seção “Minha história”.

## Canal e mensagem

`src/site/shared/contact.ts` centraliza o contato já existente: Instagram `@ravera.designn`, conversa `https://ig.me/m/ravera.designn`. O número oficial de WhatsApp está vazio no projeto.

“Solicitar orçamento” só é habilitado quando existe pelo menos uma peça válida. A mensagem usa a estrutura em português solicitada: saudação, lista com os nomes reais das peças, pedido de orçamento personalizado e a história significativa quando fornecida. Nenhum preço, quantidade, ID ou caminho de arquivo entra no texto. Não existe envio automático.

O Instagram não aceita mensagem pré-preenchida em sua URL. Por isso, o fluxo existente é preservado: tenta copiar o texto e abre a conversa oficial em nova aba com `noopener,noreferrer`. O painel mantém o texto completo, um botão para copiar novamente e um link explícito, inclusive se clipboard ou popup forem bloqueados. O cliente cola a mensagem na conversa. A seleção e a história continuam disponíveis para edição e reenvio.

O helper do WhatsApp usa `encodeURIComponent` na mensagem inteira caso um número oficial seja configurado futuramente. Unicode, quebras de linha e caracteres reservados foram verificados sem inserir dados do cliente diretamente numa URL não escapada.

## Acessibilidade e responsividade

Diálogo modal nativo com título programático, foco inicial, contenção de foco incluindo textareas, Escape, retorno à folha, bloqueio de rolagem e avisos `aria-live`. Botões de seleção usam `aria-pressed` e um símbolo de confirmação; o estado não depende apenas de cor. A história tem label e descrição explícitos; a ação desabilitada explica a exigência de uma peça.

O painel fica na lateral em desktop e ocupa a largura disponível em mobile. Conteúdo rola independentemente; cabeçalho e orçamento permanecem acessíveis. Safe areas e `visualViewport` ajustam a altura quando o teclado reduz a área visível. Controles têm pelo menos 44 px de altura; movimento reduzido remove as animações.

## Verificações concluídas

- `npm.cmd run build`: TypeScript e build de produção passaram.
- `node node_modules/typescript/bin/tsc -b --pretty false`: checagem independente passou.
- `npm.cmd run lint`: sem erros ou avisos.
- `npm.cmd test`: 17 testes de estado, migração, sessão, mensagem, codificação e renderização no servidor, incluindo catálogo vazio e metadados opcionais ausentes.
- `npm.cmd run test:browser`: 15 grupos de cenários passaram no desenvolvimento e no build de produção servido por `npm.cmd run preview -- --host 127.0.0.1 --port 4174`. Cobrem seleção, história, orçamento, navegação, arquivos históricos, recarga, migração, limpeza, foco, teclado, viewport curto, imagem ausente, storage/clipboard/popup bloqueados e aba nova. O contato é simulado; nenhuma mensagem é enviada.
- Capturas e verificação de overflow em 320, 375, 430, 768, 1024 e 1440 px. Redimensionamento de teclado é simulado via `visualViewport`; não substitui teste em um aparelho físico.
- `git diff --check`: convenções e espaços; o projeto não tem formatter configurado.
- `git diff --name-only -- src/alternatives archive prototipos/landing1 prototipos/landing2`: confirma preservação dos arquivos históricos.
- Fontes oficiais Cormorant Garamond e Jost carregadas; nenhum erro, aviso ou falha de recurso no navegador. Capturas de desktop, tablet, mobile, história e mensagem revisadas visualmente.

Os relatórios JSON e capturas ficam em `%TEMP%/ravera-quotation-qa-dev/` e `%TEMP%/ravera-quotation-qa-production/`.

## Limitações reais

O catálogo inicial não fornece categorias associadas aos cinco produtos, pesquisa ou filtros; nenhum foi inventado. Nomes, resumos, materiais e dimensões existentes foram preservados, com fotografias WebP disponíveis no projeto. Descrições com `Lorem ipsum` não são publicadas. O Instagram exige colar manualmente a mensagem; nenhum número de WhatsApp ou endereço de email foi criado.
