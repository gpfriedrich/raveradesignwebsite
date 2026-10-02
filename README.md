# RAVERA — site oficial

A landing3 escolhida pela cliente é a página inicial em `/`. A antiga rota `/landing3/` continua como alias. O projeto usa React, TypeScript e Vite.

## Executar e verificar

```bash
npm install
npm run dev
npm run build
npm run lint
```

Não há script de testes automatizados no `package.json`.

## Estrutura

- `src/site/landing3/`: componente, conteúdo e estilos exclusivos do site oficial.
- `src/alternatives/landing1/`: versão editorial, incluindo catálogo e páginas de produto.
- `src/alternatives/landing2/`: versão narrativa e seus estilos.
- `src/App.tsx`: seleção das rotas; os protótipos são carregados sob demanda.
- `vite.config.ts` e `prototipos/`: entradas HTML para hospedagem estática.
- `public/ravera/`: arquivos de marca e imagens usados pelas páginas. As fotos próprias da landing3 ficam em `public/ravera/landing3/`; as imagens das versões anteriores estão em `instagram/` e `portfolio/`.
- `archive/landing1-landing2/`: cópia integral do código anterior à separação para consulta histórica.

## Consultar versões anteriores

- `/prototipos/landing1/` — landing1.
- `/prototipos/landing2/` — landing2.
- `/prototipos/catalogo/` — catálogo da landing1, com cinco páginas de produto em `/prototipos/catalogo/<slug>/`.

Essas rotas fazem parte do build para consulta direta, mas não aparecem nos menus ou no rodapé do site oficial. Para reativar uma versão como página inicial, ajuste a seleção de rota em `src/App.tsx` e o conteúdo de `index.html` conforme necessário. Os arquivos originais permanecem em `archive/landing1-landing2/`.
