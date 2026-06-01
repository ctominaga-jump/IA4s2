# Tech Stack do MVP

## Contexto

O portal **IA para Vida Real** precisa validar rapidamente um fluxo de SaaS educacional:

- cadastro e login;
- area do aluno;
- missoes;
- envio de entregas;
- XP e niveis;
- area do professor;
- fila de validacao;
- feedback e aprovacao/reprovacao.

Os criterios principais para a escolha da stack sao:

- simplicidade;
- velocidade de desenvolvimento;
- baixo custo inicial;
- facilidade para evoluir para SaaS;
- boa experiencia para desenvolvimento assistido por IA;
- manutencao simples por equipe pequena.

## Stack Recomendada

### Frontend e Backend Web

**Next.js com App Router e TypeScript**

Uso previsto:

- paginas publicas e autenticadas;
- dashboards de aluno e professor;
- server components;
- server actions ou API routes para operacoes de escrita;
- renderizacao dinamica para telas autenticadas;
- base full-stack em um unico projeto.

### UI

**Tailwind CSS + shadcn/ui + lucide-react**

Uso previsto:

- componentes de formulario;
- cards de dashboard;
- tabelas/listas de validacao;
- indicadores visuais de status;
- botoes, inputs, textareas, dialogs e empty states;
- icones consistentes.

### Banco de Dados

**Supabase Postgres**

Uso previsto:

- persistencia das entidades do MVP;
- tabelas de usuarios de dominio, perfis, cursos, modulos, missoes, entregas, feedback, XP e niveis;
- consultas relacionais;
- constraints para evitar XP duplicado;
- possibilidade futura de relatorios, multi-tenant e analytics.

### Autenticacao

**Supabase Auth**

Uso previsto:

- cadastro com e-mail e senha;
- login/logout;
- sessao autenticada;
- integracao com Postgres;
- base futura para OAuth, magic link, MFA ou SSO.

### Acesso a Dados

**Supabase JS Client + SQL migrations**

Uso previsto:

- cliente server-side para leituras e escritas;
- uso de policies e permissoes conforme maturidade do MVP;
- migrations SQL versionadas;
- tipos TypeScript gerados a partir do banco quando o projeto amadurecer.

Observacao:

Para o MVP, recomenda-se evitar ORM no inicio. O modelo e pequeno, Supabase ja fornece SDK e Postgres direto, e reduzir camadas acelera a entrega. Se o produto crescer, Drizzle ORM pode ser introduzido posteriormente para type safety mais forte em queries complexas.

### Deploy

**Vercel**

Uso previsto:

- deploy simples de Next.js;
- previews por branch;
- variaveis de ambiente;
- CI/CD automatico;
- bom caminho para validar piloto rapidamente.

### Observabilidade Inicial

**Logs nativos da Vercel + logs do Supabase**

Uso previsto:

- investigar falhas de login;
- investigar falhas de envio;
- investigar falhas de validacao;
- acompanhar erros do piloto sem contratar ferramenta adicional.

Ferramentas como Sentry ou Logtail podem entrar depois, quando houver uso real ou necessidade de rastreio mais detalhado.

## Justificativa

### Por que Next.js

Next.js permite construir frontend e backend leve no mesmo projeto, o que reduz complexidade operacional para um MVP. O App Router oferece uma estrutura moderna para paginas, layouts, server components e rotas dinamicas.

Para este produto, isso e especialmente util porque a maior parte do MVP e composta por telas autenticadas com consultas e formularios simples.

### Por que Supabase

Supabase combina Postgres, Auth, APIs, Storage e recursos de seguranca em uma plataforma unica. Para o MVP, isso reduz o tempo necessario para implementar autenticacao, banco, regras de acesso e operacao basica.

Postgres tambem e uma escolha forte para um SaaS educacional porque o dominio e relacional: usuarios, perfis, missoes, entregas, feedbacks, XP e niveis possuem relacoes claras.

### Por que Tailwind e shadcn/ui

Tailwind acelera a criacao de interfaces responsivas sem exigir um design system completo no inicio. shadcn/ui oferece componentes copiaveis e customizaveis, o que evita dependencia pesada e facilita ajustes de produto.

Para dashboards, listas, formularios e estados vazios, essa combinacao entrega velocidade com boa qualidade visual.

### Por que Vercel

Vercel e a opcao mais simples para publicar Next.js rapidamente, com previews automaticos e pouco atrito de configuracao.

Para um piloto, isso economiza tempo. Para virar SaaS comercial, deve-se migrar do plano gratuito para plano apropriado e monitorar uso/custo.

## Alternativas

### Alternativa A: Next.js + Prisma + Neon/Postgres + Auth.js

Vantagens:

- maior controle sobre banco e autenticacao;
- ORM conhecido;
- menor dependencia de BaaS;
- boa portabilidade.

Desvantagens:

- mais pecas para configurar;
- autenticacao exige mais decisoes;
- permissoes e seguranca ficam mais sob responsabilidade do time;
- desenvolvimento inicial mais lento.

Quando escolher:

- se o time ja domina Prisma/Auth.js;
- se houver exigencia forte de independencia de fornecedor;
- se Supabase nao for uma opcao por compliance ou preferencia tecnica.

### Alternativa B: Laravel + PostgreSQL

Vantagens:

- framework maduro e produtivo;
- excelente para CRUD, auth e backoffice;
- ecossistema robusto;
- boa previsibilidade para SaaS.

Desvantagens:

- frontend moderno exige camada adicional ou stack full-stack especifica;
- pode ser menos natural para equipes focadas em React/TypeScript;
- menor aderencia a componentes React como shadcn/ui.

Quando escolher:

- se a equipe tiver forte experiencia em PHP/Laravel;
- se o foco for painel administrativo tradicional;
- se houver preferencia por backend monolitico classico.

### Alternativa C: Django + PostgreSQL

Vantagens:

- framework maduro;
- admin nativo poderoso;
- bom para regras de negocio e dados relacionais;
- rapido para backoffice.

Desvantagens:

- frontend React fica separado ou exige integracao adicional;
- mais decisao arquitetural entre API e frontend;
- experiencia de UI moderna pode levar mais tempo.

Quando escolher:

- se a equipe domina Python/Django;
- se o admin interno for mais importante que a experiencia rica do aluno;
- se futuras rotinas de dados/IA em Python forem centrais.

### Alternativa D: Bubble, FlutterFlow ou ferramenta no-code/low-code

Vantagens:

- prototipacao muito rapida;
- baixo esforco tecnico inicial;
- bom para testar fluxo e copy.

Desvantagens:

- pode limitar customizacao;
- pode dificultar regras mais especificas de gamificacao e validacao;
- risco de reescrita cedo;
- menor controle tecnico para SaaS escalavel.

Quando escolher:

- se o objetivo for validar apenas demanda, antes de investir em codigo;
- se nao houver desenvolvedor disponivel;
- se o piloto precisar sair em poucos dias.

### Alternativa E: React SPA + Firebase

Vantagens:

- muito rapido para auth e dados;
- bom plano gratuito inicial;
- realtime simples.

Desvantagens:

- modelo NoSQL exige cuidado para relacoes do dominio;
- consultas relacionais e relatorios podem ficar mais complexos;
- migracao futura para relacional pode ser trabalhosa.

Quando escolher:

- se a experiencia realtime for prioridade;
- se a equipe ja domina Firebase;
- se o modelo de dados for mais documental do que relacional.

## Decisao Final

A stack recomendada para o MVP e:

- **Next.js + TypeScript** para aplicacao full-stack.
- **Tailwind CSS + shadcn/ui + lucide-react** para interface.
- **Supabase Auth** para autenticacao.
- **Supabase Postgres** para banco de dados.
- **Supabase JS Client + SQL migrations** para acesso a dados e versionamento inicial.
- **Vercel** para deploy.

Esta combinacao e a melhor para o momento porque entrega o menor caminho entre documentacao de produto e MVP funcional, mantendo uma base tecnicamente aceitavel para evoluir para SaaS.

## Arquitetura Inicial Sugerida

```text
Next.js App Router
  app/
    (public)/
    aluno/
    professor/
    auth/
  components/
  lib/
    supabase/
    auth/
    gamification/
  server/
    submissions/
    feedback/
    xp/

Supabase
  Auth
  Postgres
  SQL migrations
  Row Level Security em evolucao

Vercel
  Deploy
  Environment variables
  Preview deployments
```

## Riscos Tecnicos

### Crescimento de regras em Server Actions

Risco:

As regras de entrega, validacao e XP podem se espalhar por actions e componentes.

Mitigacao:

Concentrar regras em servicos de dominio, como `submissions`, `feedback` e `xp`.

### Uso incorreto de permissoes no Supabase

Risco:

Policies mal configuradas podem expor dados de alunos ou permitir acoes indevidas.

Mitigacao:

Comecar com operacoes sensiveis no servidor, validar role em todas as actions e evoluir Row Level Security com testes.

### Custos da Vercel ao virar SaaS comercial

Risco:

O plano gratuito da Vercel e voltado a uso pessoal/nao comercial. Ao virar SaaS, sera necessario usar plano pago e monitorar consumo.

Mitigacao:

Configurar limites de gasto, acompanhar uso e manter alternativa de deploy futuro em plataformas como Render, Fly.io, Railway ou container proprio.

### Lock-in moderado no Supabase

Risco:

Auth, client SDK e recursos de plataforma podem criar dependencia operacional.

Mitigacao:

Manter modelo relacional em Postgres, migrations SQL versionadas e separar regras de negocio da camada de SDK.

### Ausencia inicial de ORM

Risco:

Queries manuais podem perder type safety conforme o produto cresce.

Mitigacao:

Usar tipos gerados do Supabase e considerar Drizzle quando consultas e regras ficarem mais complexas.

### Complexidade futura de multi-tenant

Risco:

O MVP ainda nao define organizacoes, turmas avancadas ou isolamento institucional completo.

Mitigacao:

Evitar assumptions rigidas no modelo e planejar entidades como `Organization`, `Classroom` e permissoes institucionais antes da primeira versao SaaS paga.

### Feedback e XP precisam de consistencia transacional

Risco:

Uma aprovacao pode criar feedback sem conceder XP, ou conceder XP duplicado.

Mitigacao:

Implementar operacao atomica para aprovacao, feedback, status da entrega e `XPTransaction`, com constraint unica por aluno/missao.

## Fontes Consultadas

- Next.js App Router: https://nextjs.org/docs/app
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Database: https://supabase.com/docs/guides/database/overview
- Supabase Pricing: https://supabase.com/docs/pricing
- Vercel Pricing: https://vercel.com/pricing
- Vercel Hobby Plan: https://vercel.com/docs/accounts/plans/hobby
- shadcn/ui: https://ui.shadcn.com/docs
- Drizzle ORM: https://orm.drizzle.team/docs/overview
