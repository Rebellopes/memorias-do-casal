# Nossas Memórias

Uma cápsula do tempo digital para casais — um site pessoal para registrar e celebrar a história de um relacionamento.

Construído com Next.js, Supabase, e integrações com Spotify e Google Photos.

## Estrutura

```
memorias-do-casal/
├── apps/
│   └── web/            # Next.js 15 (App Router)
├── packages/
│   ├── config-eslint/   # Compartilhado
│   ├── config-tailwind/ # Compartilhado
│   ├── config-typescript/ # Compartilhado
│   └── types/           # Tipos compartilhados
├── supabase/
│   └── migrations/      # Migrações SQL (4 aplicadas)
└── package.json         # Turborepo + npm workspaces
```

## Funcionalidades

- **Linha do tempo** — contador de tempo juntos, "Hoje em Outros Anos"
- **Galeria** — fotos com filtros por ano/mês, lightbox, destaque de favoritas
- **Dedicatórias** — mensagens especiais com compartilhamento
- **Música** — atividade do Spotify em tempo real
- **Eventos** — registro de momentos importantes
- **Recados diários** — mensagens do dia
- **Admin** — dashboard para gerenciar conteúdo
- **Tema escuro** — alternância entre claro/escuro

## Stack

| Camada        | Tecnologia                        |
|---------------|-----------------------------------|
| Framework     | Next.js 15 (App Router)           |
| Banco         | Supabase (PostgreSQL)             |
| Autenticação  | Supabase Auth                     |
| Estilo        | Tailwind CSS                      |
| Monorepo      | Turborepo + npm workspaces        |
| Fontes        | Inter (sans) + Cormorant Garamond (serif) |

## Começando

```bash
# Instalar dependências
npm install

# Variáveis de ambiente
cp apps/web/.env.example apps/web/.env.local
# Preencher NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Iniciar dev
npm run dev

# Aplicar migrations (após configurar Supabase)
npm run db:push

# Gerar types do banco
npm run db:types
```

### Supabase

O projeto usa Supabase como backend. Crie um projeto em [supabase.com](https://supabase.com) e preencha as variáveis de ambiente com as credenciais do projeto.

### Integrações (opcionais)

Para Spotify e Google Photos funcionarem, crie apps de desenvolvedor:

1. **Spotify**: [Developer Dashboard](https://developer.spotify.com/dashboard) — adicionar redirect URI `{SITE_URL}/api/spotify/callback`
2. **Google Photos**: [Google Cloud Console](https://console.cloud.google.com/) — ativar Photos Library API, adicionar redirect URI `{SITE_URL}/api/google/callback`

Preencher as credenciais em `.env.local`:

```env
SPOTIFY_CLIENT_ID=seu_id
SPOTIFY_CLIENT_SECRET=seu_secret
GOOGLE_CLIENT_ID=seu_id
GOOGLE_CLIENT_SECRET=seu_secret
```

## Scripts

| Comando               | Descrição                        |
|-----------------------|----------------------------------|
| `npm run dev`         | Iniciar dev (todas apps)         |
| `npm run build`       | Build de produção                |
| `npm run lint`        | ESLint                           |
| `npm run typecheck`   | TypeScript                       |
| `npm run db:push`     | Aplicar migrations Supabase      |
| `npm run db:types`    | Regenerar types do banco         |
| `npm run format`      | Prettier                         |

## Roadmap

- [x] Fundação — monorepo, Supabase, autenticação, layout base
- [x] MVP — CRUD completo, admin, páginas públicas
- [x] Integrações — Spotify OAuth, Google Photos OAuth
- [x] Refinamento — tema escuro, SEO, animações, next/image
- [ ] Deploy Vercel
- [ ] PWA / offiline
- [ ] Notificações

Feito com ❤️
