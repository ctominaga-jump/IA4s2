# Roteiro de QA — MVP IA para Vida Real

Roteiro de teste manual do fluxo ponta a ponta. Baseado nos criterios de aceite
de `product/mvp-scope.md` e no agente `prompts/agents/qa-tester.md`.

## Pre-condicoes

- Migrations e seeds aplicados (ver `database/README.md`).
- App rodando (`npm run dev`) com `.env.local` configurado.
- Confirmacao de e-mail desativada no Supabase (recomendado para o piloto).
- Ter a mao 2 e-mails distintos: um para **professor**, um para **aluno**.

Legenda: ✅ = resultado esperado.

---

## 1. Cadastro, login e logout

| # | Passo | Esperado |
|---|---|---|
| 1.1 | Cadastrar como **professor** (nome, e-mail, senha, perfil Professor) | ✅ Redireciona para `/professor` |
| 1.2 | Logout | ✅ Volta para `/login` |
| 1.3 | Cadastrar como **aluno** com o mesmo e-mail do professor | ✅ Erro: e-mail ja cadastrado |
| 1.4 | Cadastrar como **aluno** com e-mail novo | ✅ Vai para `/onboarding` |
| 1.5 | Senha com menos de 6 caracteres | ✅ Erro de validacao, sem criar conta |
| 1.6 | Login com senha errada | ✅ Erro "E-mail ou senha invalidos" |
| 1.7 | Login do aluno correto | ✅ Vai para `/aluno` (ou `/onboarding` se nao concluido) |

## 2. Autorizacao por perfil

| # | Passo | Esperado |
|---|---|---|
| 2.1 | Deslogado, abrir `/aluno` | ✅ Redireciona para `/login?redirectTo=/aluno` |
| 2.2 | Deslogado, abrir `/professor` | ✅ Redireciona para `/login` |
| 2.3 | Logado como **aluno**, abrir `/professor` | ✅ Redireciona para `/aluno` |
| 2.4 | Logado como **professor**, abrir `/aluno` | ✅ Redireciona para `/professor` |
| 2.5 | Aluno tenta abrir `/professor/fila` | ✅ Redireciona para `/aluno` |

## 3. Onboarding e objetivo real

| # | Passo | Esperado |
|---|---|---|
| 3.1 | No onboarding, enviar sem objetivo | ✅ Erro: objetivo obrigatorio |
| 3.2 | Preencher objetivo (ex.: "passar em uma prova"), categoria e nivel; concluir | ✅ Vai para `/aluno`; objetivo aparece no dashboard |
| 3.3 | No dashboard, editar o objetivo e salvar | ✅ Texto atualizado sem promessa de trilha automatica |
| 3.4 | Reabrir `/onboarding` apos concluido | ✅ Redireciona para `/aluno` |

## 4. Lista de missoes (jornada)

| # | Passo | Esperado |
|---|---|---|
| 4.1 | Abrir `/aluno/missoes` | ✅ 5 missoes do seed, ordenadas, com XP e status "Nao iniciada" |
| 4.2 | Abrir uma missao | ✅ Mostra descricao, objetivo, instrucoes, entrega esperada e XP |
| 4.3 | Barra de progresso | ✅ 0% inicialmente |

## 5. Envio de entrega

| # | Passo | Esperado |
|---|---|---|
| 5.1 | Enviar entrega com texto vazio | ✅ Bloqueado (campo obrigatorio) |
| 5.2 | Enviar entrega com texto | ✅ Confirmacao "aguardando validacao"; status muda para "Aguardando validacao" |
| 5.3 | Tentar enviar de novo a mesma missao (pendente) | ✅ Botao de envio nao disponivel; missao em "pending" |
| 5.4 | Dashboard do aluno | ✅ Contador "Em validacao" = 1 |

## 6. Fila e validacao (professor)

| # | Passo | Esperado |
|---|---|---|
| 6.1 | Logar como professor, abrir `/professor` | ✅ Card "Pendentes" >= 1; entrega listada em recentes |
| 6.2 | Abrir fila de validacao | ✅ Entrega pendente aparece no topo |
| 6.3 | Abrir o detalhe da entrega | ✅ Mostra nome do aluno, **objetivo real**, contexto da missao e a resposta |
| 6.4 | Tentar confirmar sem feedback | ✅ Bloqueado (feedback obrigatorio) |

## 7. Reprovacao e reenvio

| # | Passo | Esperado |
|---|---|---|
| 7.1 | Reprovar a entrega com feedback | ✅ Avaliacao registrada; entrega sai de "pendentes" |
| 7.2 | Logar como aluno, abrir a missao | ✅ Feedback de reprovacao visivel; botao "Reenviar entrega" disponivel |
| 7.3 | Reenviar com novo texto | ✅ Nova tentativa (attempt 2), status pendente; feedback anterior continua acessivel |
| 7.4 | Professor abre o detalhe | ✅ Secao "Tentativas anteriores" mostra a tentativa 1 e seu feedback |

## 8. Aprovacao, XP e niveis

| # | Passo | Esperado |
|---|---|---|
| 8.1 | Professor aprova a entrega (com feedback) | ✅ Status "Aprovada"; avaliacao registrada |
| 8.2 | Aluno volta ao dashboard | ✅ XP somado (= XP da missao); contador "Aprovadas" +1 |
| 8.3 | Aprovar mais missoes ate passar de 99 XP | ✅ Nivel sobe (ex.: nivel 2 a partir de 100 XP) |
| 8.4 | Tela da missao aprovada | ✅ Sem novo envio; informa o XP ganho |

## 9. Nao-duplicidade de XP (regra critica)

| # | Passo | Esperado |
|---|---|---|
| 9.1 | Verificar que missao aprovada nao permite reenvio | ✅ Sem botao de envio |
| 9.2 | (DB) Conferir `xp_transactions` | ✅ No maximo 1 linha `mission_approved` por aluno/missao |
| 9.3 | (DB) `student_profiles.total_xp` | ✅ Igual a soma das missoes aprovadas |

## 10. Dashboards e estados vazios

| # | Passo | Esperado |
|---|---|---|
| 10.1 | Aluno novo sem entregas | ✅ Estados vazios orientam comecar uma missao |
| 10.2 | Professor sem entregas | ✅ "Nenhuma entrega ainda" |
| 10.3 | Fila com filtro sem itens | ✅ Mensagem de fila vazia |
| 10.4 | Dashboards atualizam apos cada acao | ✅ Contadores refletem envios/avaliacoes |

---

## Checagens de banco (opcionais via SQL Editor)

```sql
-- XP nao duplicado por missao/aluno
select student_profile_id, mission_id, count(*)
from xp_transactions
where reason = 'mission_approved'
group by 1, 2
having count(*) > 1;   -- deve retornar 0 linhas

-- total_xp coerente com as transacoes
select sp.id, sp.total_xp, coalesce(sum(x.amount), 0) as soma
from student_profiles sp
left join xp_transactions x on x.student_profile_id = sp.id
group by sp.id, sp.total_xp
having sp.total_xp <> coalesce(sum(x.amount), 0);  -- deve retornar 0 linhas
```

## Resultado

- [ ] Fluxo feliz (cadastro → objetivo → envio → aprovacao → XP/nivel) passa.
- [ ] Reprovacao e reenvio funcionam.
- [ ] XP nao duplica.
- [ ] Rotas por perfil sao bloqueadas.
- [ ] Estados vazios sao compreensiveis.

> Recomendacao de pronto/nao-pronto para deploy ao final da execucao.

---

## QA funcional ja executada no banco (29/05/2026)

Executada via SQL direto no projeto Supabase `ia-para-vida-real`
(`gvivzcajymwhljvjrjoq`), exercitando a RPC `review_submission` e as regras de
negocio criticas. Dados de teste criados e removidos ao final (seed preservado).

| Regra | Resultado |
|---|---|
| Reprovacao com feedback → status `rejected`, sem XP | ✅ `xp_awarded=0`, `total_xp=0` |
| Reenvio (tentativa 2) apos reprovacao | ✅ Permitido (1 pendente por vez) |
| Aprovacao → concede XP da missao (50) e recalcula nivel | ✅ `xp_awarded=50`, `total_xp=50`, nivel 1 |
| Subir de nivel ao cruzar faixa (missao 2 = 60 → 110 XP) | ✅ nivel 2 "Aprendiz de Prompts" |
| Reavaliar entrega ja avaliada | ✅ Bloqueado: `submission_not_pending` |
| Feedback obrigatorio (comentario vazio) | ✅ Bloqueado: `feedback_required` |
| XP nao duplicado por aluno/missao | ✅ `0` duplicados; `total_xp == soma(xp_transactions)` |
| Duas entregas pendentes na mesma missao | ✅ Bloqueado: `submissions_one_pending_per_mission` (23505) |
| Advisors de seguranca (Supabase linter) | ✅ Sem WARN; RPC fechada a anon/authenticated; `search_path` fixado. Restam apenas INFO `rls_enabled_no_policy` (intencional) |

**Pendente (requer app rodando + chave `service_role` + navegador):** QA de UI
ponta a ponta (cadastro/login reais via Supabase Auth, navegacao, estados vazios
e bloqueio de rotas por perfil) — seguir as secoes 1 a 10 acima.
