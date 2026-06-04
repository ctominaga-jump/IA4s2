# Deploy no Render — IA para Vida Real

Guia passo a passo para publicar este app **Next.js (App Router)** no
[Render](https://render.com) como **Web Service Node**.

> O repo já está preparado: existe um `render.yaml` (Blueprint) na raiz.
> Você **não precisa** dar acesso às suas credenciais a ninguém — tudo é
> feito por você no dashboard do Render. Os secrets são cadastrados lá,
> nunca no Git.

---

## 0. Pré-requisitos (já validados localmente)

Antes de publicar, estes comandos foram rodados e passaram:

| Comando            | Resultado |
| ------------------ | --------- |
| `npm run typecheck`| ✅ 0 erros |
| `npm run lint`     | ✅ sem warnings |
| `npm run test`     | ✅ 25 testes |
| `npm run build`    | ✅ build de produção OK |

O app é **server-rendered** (todas as rotas são dinâmicas e há um
middleware de sessão Supabase). Por isso ele **não** é static export e
**precisa** de um *Web Service* (que roda `next start`), e não de um
*Static Site*.

---

## 1. Configuração que o Render vai usar

Definida no `render.yaml` (e replicável manualmente no dashboard):

| Item              | Valor                              |
| ----------------- | ---------------------------------- |
| Tipo              | **Web Service**                    |
| Runtime/Language  | **Node**                           |
| Plano             | **Free**                           |
| Build Command     | `npm install && npm run build`     |
| Start Command     | `npm run start`                    |
| Node version      | **22** (LTS — via `NODE_VERSION` e `.nvmrc`) |
| Porta             | automática — o Render injeta `PORT`, e o `next start` respeita |

---

## 2. Variáveis de ambiente

Cadastre **todas** pelo dashboard do Render (aba **Environment**).
**Não** comite valores. No `render.yaml` elas estão como `sync: false`,
o que faz o Render pedir o valor na primeira criação.

| Variável                         | Tipo            | Quando é usada            | Secreta? |
| -------------------------------- | --------------- | ------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | build + cliente | inlined no bundle do client durante o `build` | Não (vai pro navegador), mas cadastre mesmo assim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | build + cliente | idem acima                | Não      |
| `SUPABASE_SERVICE_ROLE_KEY`      | runtime/server  | só no servidor, ignora RLS | **SIM — secreta** |
| `NODE_VERSION`                   | build           | fixa a versão do Node     | Não      |
| `ENABLE_PREVIEW_ROUTES`          | runtime/server (opcional) | `1` libera `/preview/avatar-evolution` em produção para validar os avatares 3D online; remova a variável para voltar a bloquear | Não      |

**Importante sobre `NEXT_PUBLIC_*`:** essas variáveis são "assadas" no
bundle do client **na hora do `next build`**. O Render disponibiliza as
env vars durante o build, então basta cadastrá-las antes do primeiro
deploy. Se você mudar o valor delas depois, é preciso **rebuild** (não
basta restart) para refletir no client.

Os valores você pega no painel do Supabase em **Project Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` → *Project URL*
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → *anon / publishable key*
- `SUPABASE_SERVICE_ROLE_KEY` → *service_role key* (copie manualmente; é secreta)

> ⚠️ **Não defina `NODE_ENV=production` como env var no Render.** Isso faria
> o `npm install` pular as `devDependencies` (TypeScript, ESLint), e o
> `next build` quebraria. O Render já cuida do `NODE_ENV` em runtime
> sozinho — deixe essa variável de fora.

---

## 3. Passo a passo no dashboard do Render

### 3.1 Criar conta / logar
1. Acesse <https://dashboard.render.com> e crie conta (pode usar login com GitHub).

### 3.2 Conectar o GitHub
1. No dashboard, vá em **Account Settings → GitHub** (ou aceite o prompt ao criar o serviço).
2. Autorize o app do Render e dê acesso ao repositório deste projeto.

### 3.3 Criar o Web Service
Você tem **duas opções** — escolha **uma**:

**Opção A — via Blueprint (recomendada, usa o `render.yaml`):**
1. Clique em **New + → Blueprint**.
2. Selecione o repositório conectado.
3. O Render lê o `render.yaml` e já propõe o serviço `ia-para-vida`
   com build/start/Node corretos.
4. Ele vai pedir os valores das env vars marcadas como `sync: false`
   (as três do Supabase) — **cole os valores aqui**.
5. Clique em **Apply**.

**Opção B — manual (sem Blueprint):**
1. Clique em **New + → Web Service**.
2. Selecione o repositório.
3. Preencha:
   - **Language/Runtime:** Node
   - **Branch:** `main` (ou a branch que você quer publicar)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Instance Type / Plan:** Free
4. Em **Environment**, adicione as variáveis da seção 2
   (incluindo `NODE_VERSION = 22`).

### 3.4 Selecionar branch
- Confirme que a branch é a correta (o `render.yaml` usa `main`).
  Se a sua branch principal tem outro nome, ajuste no dashboard
  **ou** edite o campo `branch:` no `render.yaml` antes de aplicar.

### 3.5 Build & Start commands
- Já preenchidos pelo Blueprint. Na opção manual, use exatamente:
  - Build: `npm install && npm run build`
  - Start: `npm run start`

### 3.6 Cadastrar env vars
- Garanta que estão cadastradas (seção 2). Sem `SUPABASE_SERVICE_ROLE_KEY`
  o servidor não consegue fazer as operações server-side.

### 3.7 Fazer o deploy
1. Clique em **Create Web Service** / **Apply**.
2. Acompanhe os logs de build. Você deve ver:
   - `npm install` instalando dependências;
   - `next build` com `✓ Compiled successfully`;
   - o serviço subindo com `next start`.

### 3.8 Validar a URL final
1. O Blueprint cria o serviço `ia-para-vida`, então a URL pública esperada é
   `https://ia-para-vida.onrender.com/`.
2. Abra a URL e cheque:
   - a página de **login** (`/login`) carrega;
   - login com um usuário de teste funciona (a sessão depende do middleware
     Supabase + cookies — confirme que as env vars estão certas);
   - navegue para uma rota de aluno/professor para confirmar render no servidor.
3. Se algo falhar, veja **Logs** no dashboard.

---

## 4. Observações sobre o Free Tier

- O serviço Free **hiberna após ~15 min sem tráfego**; a primeira
  requisição depois disso leva alguns segundos pra "acordar" (cold start).
- Recursos limitados de CPU/RAM — suficiente para validação/demo, não
  para carga de produção real.
- Para evitar hibernação, faça upgrade de plano quando for pra produção.

---

## 5. Migrations / banco (NÃO automatizado)

Este deploy **não** roda migrations nem toca no banco. O schema, RLS,
funções de XP, review e Boss Final já vivem no Supabase e **não** são
gerenciados por este pipeline. Se em algum momento for preciso aplicar
migrations:

- Faça via Supabase (CLI/dashboard), **fora** do deploy do Render;
- **Não** adicione um `preDeployCommand` de migration sem aprovação
  explícita — alterações de banco são sensíveis e estão fora do escopo
  deste deploy.

---

## 6. O que você precisa fazer (resumo de cliques)

1. Logar em <https://dashboard.render.com> (login com GitHub).
2. **New + → Blueprint** → escolher este repo.
3. Colar os valores das 3 env vars do Supabase quando solicitado.
4. **Apply** e acompanhar o build.
5. Abrir `https://ia-para-vida.onrender.com/` e validar `/login`.

Nada disso exige suas credenciais aqui — é tudo no painel do Render,
feito por você.
