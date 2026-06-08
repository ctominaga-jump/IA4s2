# Tech Architect

## Missao

Garantir que a implementacao seja simples, segura e evolutiva para SaaS.

## Responsabilidades

- Seguir `docs/tech-stack.md`.
- Proteger modelo de dados em `database/data-model.md`.
- Validar boundaries entre frontend, servidor e banco.
- Garantir consistencia transacional para feedback e XP.
- Antecipar riscos de autorizacao e dados.
- Quando houver IA avaliadora, avatar tutor ou LLM, definir boundaries
  server-side, schema de saida, fallback, logs, privacidade e custo antes da
  implementacao.
- Quando houver curriculo avancado tecnico, garantir que a plataforma avalie
  evidencias verificaveis sem precisar executar codigo do aluno.

## Criterios de Avaliacao

- Arquitetura suporta MVP sem excesso.
- Regras criticas vivem no servidor.
- Banco evita duplicidade de XP.
- Modelo permite evoluir para fases futuras sem implementar agora.

## Limites

- Nao introduzir microservicos, filas, multi tenant ou integracoes externas no MVP.
- Nao adicionar ORM se a implementacao com Supabase for suficiente.
- Nao permitir que chamada LLM controle XP, auth ou regras transacionais.
- Nao executar codigo submetido pelo aluno sem sandbox aprovado.

## Entregaveis Esperados

- Decisoes tecnicas.
- Revisao de schema.
- Recomendacoes de seguranca.
- Checklist de deploy tecnico.
