# Banco de Dados — IA para Vida Real

Modelo conforme [`database/data-model.md`](data-model.md). Acesso via Supabase
Postgres. Sem ORM no MVP (decisao de `docs/tech-stack.md`).

## Ordem de execucao

| Ordem | Arquivo | Conteudo |
|---:|---|---|
| 1 | `migrations/0001_init.sql` | Extensao `pgcrypto`, enums, tabelas, constraints, indices, trigger `updated_at` |
| 2 | `migrations/0002_functions.sql` | `level_for_xp(xp)` e RPC atomica `review_submission(...)` |
| 3 | `migrations/0003_rls.sql` | Habilita RLS (lockdown) e restringe execucao das funcoes |
| 4 | `migrations/0004_harden_functions.sql` | Revoga EXECUTE da RPC de anon/authenticated (deixa so service_role) e fixa `search_path` das funcoes |
| 5 | `seeds/0001_seed.sql` | 5 niveis, 1 curso, 1 modulo, 5 missoes publicadas (idempotente) |

## Como aplicar

**SQL Editor (Supabase):** cole e rode cada arquivo na ordem.

**Supabase CLI:**

```bash
supabase db execute --file database/migrations/0001_init.sql
supabase db execute --file database/migrations/0002_functions.sql
supabase db execute --file database/migrations/0003_rls.sql
supabase db execute --file database/migrations/0004_harden_functions.sql
supabase db execute --file database/seeds/0001_seed.sql
```

## Decisoes importantes

- **Senhas** ficam no Supabase Auth (`auth.users`). A tabela `users` guarda
  apenas o perfil de aplicacao, ligado por `auth_user_id`.
- **XP unico por missao/aluno:** indice unico parcial
  `xp_one_mission_approved_per_student` em `xp_transactions`.
- **Uma entrega pendente / uma aprovada por missao:** indices unicos parciais
  em `submissions`.
- **Niveis:** faixas sem sobreposicao; nivel inicial em 0 XP; ultimo nivel com
  `max_xp` nulo. `level_for_xp` resolve o nivel a partir do XP.
- **RLS:** habilitado em todas as tabelas, sem policies para `anon`/
  `authenticated`. Como o app acessa dados via service role no servidor (apos
  validar o perfil), isso bloqueia acesso direto pela chave publica. Evoluir
  para policies granulares por aluno/professor faz parte do roadmap.

## Tabela `badges`

Existe no schema como estrutura futura. **Nao** tem UI nem regra operacional no
MVP e nao e populada pelos seeds.

## Reset (ambiente de desenvolvimento)

Para recomecar do zero, recrie o schema `public` (apaga TODOS os dados):

```sql
drop schema public cascade;
create schema public;
grant usage on schema public to anon, authenticated, service_role;
grant all on schema public to postgres, service_role;
```

Depois reaplique migrations e seeds na ordem.
