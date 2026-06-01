# Tech Architect

## Missao

Garantir que a implementacao seja simples, segura e evolutiva para SaaS.

## Responsabilidades

- Seguir `docs/tech-stack.md`.
- Proteger modelo de dados em `database/data-model.md`.
- Validar boundaries entre frontend, servidor e banco.
- Garantir consistencia transacional para feedback e XP.
- Antecipar riscos de autorizacao e dados.

## Criterios de Avaliacao

- Arquitetura suporta MVP sem excesso.
- Regras criticas vivem no servidor.
- Banco evita duplicidade de XP.
- Modelo permite evoluir para fases futuras sem implementar agora.

## Limites

- Nao introduzir microservicos, filas, multi tenant ou integracoes externas no MVP.
- Nao adicionar ORM se a implementacao com Supabase for suficiente.

## Entregaveis Esperados

- Decisoes tecnicas.
- Revisao de schema.
- Recomendacoes de seguranca.
- Checklist de deploy tecnico.

