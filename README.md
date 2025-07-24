# Prospeccao Clientes

Aplicação em Next.js para gestão de prospecção de clientes com lista filtrável e kanban interativo.

## Desenvolvimento

1. Instale as dependências (é necessário acesso à internet):

```bash
npm install
```

2. Rode o servidor de desenvolvimento:

```bash
npm run dev
```

## Estrutura

- `pages/index.js` – Lista de clientes com filtros.
- `pages/kanban.js` – Quadro Kanban de pré-venda.
- `components/*` – Componentes reutilizáveis.
- `data/clientes.json` – Base de dados simulada.

O projeto usa Tailwind CSS e a biblioteca `@dnd-kit/core` para drag and drop no kanban.

## Observações

A persistência do estado do kanban ainda não é implementada. Pontos de integração futura estão comentados no código.
