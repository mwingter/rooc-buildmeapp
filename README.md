# ROOC Builds

Uma comunidade moderna para publicar, compartilhar e discutir builds de Ragnarok Origin.
O projeto usa Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL e Auth.js (NextAuth).

## Recursos implementados

- Interface responsiva com temas claro/escuro.
- Catálogo público de builds, filtros por classe, conteúdo e criador.
- Páginas detalhadas com atributos, skills, equipamentos e cartas.
- Editor de build em etapas com preview antes da publicação.
- Perfis com nick do jogo e fluxo de verificação por código temporário.
- Discord OAuth2 real em produção e provedor mock local.
- APIs tipadas com Zod para builds, comentários, amizade, perfil e administração.
- Privacidade por build (`PUBLIC`, `PRIVATE`, `FRIENDS`, `GUILD`).
- Modelos para favoritos, curtidas, clones, versões, notificações, denúncias e auditoria.
- Catálogo curado com metadados de licença e sem assets extraídos do jogo.
- Testes Vitest e fluxo E2E Playwright para a navegação principal.

## Início rápido

Requisitos: Node.js 20+, npm e Docker.

```bash
cp .env.example .env
npm install
docker compose up -d postgres
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Acesse `http://localhost:3000`. Adminer estará em `http://localhost:8080`.

Para criar um banco novo em outro ambiente:

```bash
npm run db:migrate
npm run db:seed
```

## Discord OAuth2

Crie uma aplicação em Discord Developer Portal e configure o redirect:

`http://localhost:3000/api/auth/callback/discord`

Preencha `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `NEXTAUTH_URL` e
`NEXTAUTH_SECRET` no `.env`. O provider mock aparece em ambiente local na tela
de Auth.js e não pode ser usado em produção.

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | PostgreSQL via Prisma |
| `NEXTAUTH_URL` | URL pública da aplicação |
| `NEXTAUTH_SECRET` | Assinatura de sessão |
| `DISCORD_CLIENT_ID` | OAuth2 Discord |
| `DISCORD_CLIENT_SECRET` | OAuth2 Discord |
| `S3_*` | Integração futura de objetos |

Os tokens OAuth do Discord são gerenciados pelo adapter do NextAuth/Prisma.
Tokens sensíveis não são enviados ao navegador nem armazenados em campos de perfil.

## Segurança e autorização

Todas as mutações privadas são protegidas por sessão no servidor.
Validação Zod é aplicada no backend e nos formulários.
Prisma usa consultas parametrizadas. Comentários e nomes são renderizados como texto,
não como HTML. Acesso a builds privadas é validado por autoria, amizade ou grupo/guilda.

As APIs de login, comentários e amizade possuem rate limiting em memória.
Para múltiplas instâncias ou produção, substitua por Redis. CSRF é coberto pelas
proteções de sessão do Auth.js. Logs de auditoria existem para ações administrativas.

## Dados e assets

O catálogo é curado localmente; não há scraping nem acesso ao cliente/servidor do jogo.
Cada item de catálogo pode conter `iconUrl` e `license`.
Nenhum arquivo de arte do jogo é distribuído neste repositório.
Arquivos licenciados podem ser enviados posteriormente a um armazenamento S3 compatível.

## Integração oficial futura

`lib/game-api.ts` define um adaptador estável para uma API autorizada.
Permanece com implementação local até uma API oficial existir.
Quando disponível, a implementação pode obter personagens, inventário e equipamentos
por nick, desde que esse endpoint seja público, licenciado e aprovado pelo fornecedor.
A verificação do nick não coleta senha e continua usando um código temporário.

## Scripts

```bash
npm run dev          # servidor local
npm run build        # Prisma generate + build de produção
npm run lint
npm run format
npm run test
npm run test:e2e
npm run db:seed
```

## Próximos passos

- Conectar as telas interativas ao banco via React Query ou Server Actions.
- Usar Redis para rate limiting distribuído.
- Configurar S3/R2 para imagens com validação de tipo/tamanho.
- Implementar moderação de comentários/denúncias na interface administrativa.
- Substituir o adaptador local por uma API oficial quando houver autorização.

## GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` publica uma exportação estática
da interface em GitHub Pages a partir da branch `main`.
GitHub Pages não executa Next.js server-side, APIs, NextAuth ou PostgreSQL.
A versão publicada ali é uma demonstração estática; login, publicação, comentários
e administração continuam disponíveis com `npm run dev`/`npm run build` em um host
com suporte a servidor. Para publicação completa, use GitHub Actions para build
e hospede o runtime em Render, Railway, Fly.io ou outra plataforma compatível.