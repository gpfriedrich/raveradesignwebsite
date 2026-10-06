# RAVERA — site oficial

A landing3 escolhida pela cliente é a página inicial em `/`. A antiga rota `/landing3/` continua como alias. O projeto usa React, TypeScript e Vite.

## Executar e verificar

```bash
npm install
npm run dev
npm run build
npm run lint
npm test
```

O build inclui a checagem de TypeScript. `npm test` verifica estado, persistência, rotas e renderização do catálogo sem acesso ao armazenamento no servidor. Não há formatter configurado; os arquivos seguem as convenções existentes e passam por `git diff --check`.

Para os testes de navegador, execute o servidor de desenvolvimento (ou `npm run preview`) e use `npm run test:browser` com uma instalação existente do Playwright. O script aceita `RAVERA_PLAYWRIGHT_PATH` (caminho de `playwright/index.mjs`), `RAVERA_BROWSER_PATH` (executável do Chromium/Chrome), `RAVERA_BASE_URL` (padrão `http://127.0.0.1:5173`), `RAVERA_QA_OUTPUT` (pasta dos relatórios e capturas) e `RAVERA_REQUIRE_WEBFONTS=1` para exigir as fontes oficiais. Não foi adicionada dependência de produção ou interface.

## Estrutura

- `src/site/landing3/`: componente, conteúdo e estilos exclusivos do site oficial.
- `src/site/shared/`: logo, navegação, cabeçalho, rodapé e revelações compartilhados entre a Landing 3 e o catálogo oficial.
- `src/site/catalog/`: dados do catálogo inicial, vitrine da homepage, catálogo completo, detalhes e seleção persistida por sessão.
- `src/alternatives/landing1/`: versão editorial, incluindo catálogo e páginas de produto.
- `src/alternatives/landing2/`: versão narrativa e seus estilos.
- `src/App.tsx`: seleção das rotas; os protótipos são carregados sob demanda.
- `vite.config.ts` e `prototipos/`: entradas HTML para hospedagem estática.
- `public/ravera/`: arquivos de marca e imagens usados pelas páginas. As fotos próprias da landing3 ficam em `public/ravera/landing3/`; as imagens das versões anteriores estão em `instagram/` e `portfolio/`.
- `archive/landing1-landing2/`: cópia integral do código anterior à separação para consulta histórica.

## Consultar versões anteriores

- `/prototipos/landing1/` — landing1.
- `/prototipos/landing2/` — landing2.

Essas duas rotas fazem parte do build para consulta direta, mas não aparecem nos menus ou no rodapé do site oficial. Seus componentes, estilos e entradas HTML permanecem intactos. Os arquivos históricos também permanecem em `archive/landing1-landing2/`.

## Catálogo oficial

A seção `#catalogo` substitui a antiga seção entre “A origem” e “Coleção” em `/`. O catálogo completo mantém o endereço existente `/prototipos/catalogo/` e as cinco páginas `/prototipos/catalogo/<slug>/`; o nome do caminho foi preservado para manter os links existentes. Essas páginas agora usam a identidade e os componentes oficiais, sem links públicos para as duas landings arquivadas.

A seção “Monte seu pedido” foi removida da homepage. A seleção e o pedido de orçamento existem exclusivamente no catálogo. Cada peça pode ser selecionada uma única vez; a folha conta peças distintas. Não há preços ou controles de quantidade.

A chave `ravera:catalog-selection:v2` em `sessionStorage` contém `{ selectedProductIds, story }`. IDs válidos são únicos, e a história opcional preserva integralmente o texto e as quebras de linha. O formato anterior `v1` é migrado descartando quantidades e duplicatas. A seleção é restaurada depois da montagem do cliente e permanece ao recarregar, visitar outras páginas, fechar o painel e abrir o contato. A folha e o painel são montados somente nas rotas do catálogo. Fechar a aba encerra sua sessão; remover os dados armazenados também remove a seleção. “Limpar seleção”, após confirmação, remove peças, história e armazenamento; remover uma peça mantém a história. Quando o armazenamento está bloqueado, a seleção continua funcionando em memória e o painel informa a limitação.

Os cinco nomes, resumos, materiais e dimensões vêm do catálogo inicial. As fotos usam versões WebP já existentes. Descrições com `Lorem ipsum` não são publicadas. O catálogo inicial não contém categorias associadas às peças ou filtros, por isso nenhum foi inventado.

`src/site/shared/contact.ts` centraliza o contato real. O número de WhatsApp está vazio; o fluxo atual reutiliza `@ravera.designn`: gera e tenta copiar a mensagem, abre a conversa oficial do Instagram e oferece o texto completo e um link explícito no painel. O Instagram não aceita mensagem pré-preenchida pela URL; o cliente cola o texto na conversa. Caso o número oficial seja configurado, o mesmo fluxo usa a URL do WhatsApp com `encodeURIComponent`. Nenhuma mensagem é enviada automaticamente. “Solicitar orçamento” exige pelo menos uma peça; a história aparece na mensagem somente quando contém texto significativo.

O relatório de arquivos e verificações está em `docs/catalog-implementation.md`.
