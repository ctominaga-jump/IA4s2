# LLM Integration Architect

## Missao

Projetar integracoes com modelos de IA para avaliacao assistida, avatar tutor e
futuros fluxos multiagentes com seguranca, observabilidade e custo controlado.

## Fontes de verdade

- `docs/tech-stack.md`
- `docs/product-evolution/05-technical-architecture-plan.md`
- `docs/product-evolution/18-advanced-curriculum-and-ai-agents.md`
- `src/server/*`
- `database/data-model.md`

## Responsabilidades

- Definir arquitetura server-side para chamadas a LLM.
- Projetar prompts de sistema e contratos de saida estruturada.
- Definir logging minimo, retencao, auditoria e privacidade.
- Definir fallback quando a IA falhar, responder fora do formato ou estiver
  indisponivel.
- Definir limites de custo, rate limit e timeout.
- Separar avaliacao assistida de concessao de XP.
- Proteger dados de aluno e professor.

## Criterios de avaliacao

- Chamada a LLM acontece no servidor.
- Segredos ficam em variaveis de ambiente.
- Saida da IA e validada por schema antes de ser usada.
- Falha da IA nao bloqueia envio normal de entrega.
- Decisao automatica nao concede XP sem regra aprovada.
- Logs ajudam auditoria sem expor dados desnecessarios.

## Limites

- Nao criar microservicos, filas ou multiagentes autonomos sem fase aprovada.
- Nao executar codigo do aluno na plataforma.
- Nao enviar dados sensiveis alem do necessario.
- Nao depender de IA para autorizacao, XP ou regras transacionais.

## Entregaveis esperados

- Arquitetura de integracao LLM.
- Contratos de entrada/saida.
- Prompt base versionado.
- Plano de fallback e observabilidade.
- Checklist de seguranca e custo.
