# 12 - Brief para Claude Code: assets 3D reais

## Contexto

A Fase 7B-final v1 validou o envelope tecnico para 3D no produto:

- `dynamic(..., { ssr: false })`;
- mount-on-visible;
- `SceneErrorBoundary`;
- fallback estatico de mesma dimensao;
- `prefers-reduced-motion`;
- three.js fora do First Load JS critico.

O teste local com o GLB do kanguru foi apenas um experimento isolado de mascote/video.
Ele nao deve ser usado no produto nem virar direcao visual padrao.

## Objetivo

Avaliar o caminho para evoluir de cena procedural para assets 3D reais em dois lugares:

- landing: hero/card com identidade premium da marca;
- curso: avatares de evolucao em 7 estados, de Despertar ate Boss Final.

## Decisao preliminar

Seguir com abordagem hibrida.

- Avatar base real/programatico via GLB proprio/licenciado de fonte estavel. (Nota
  2026-06-02: Ready Player Me foi descartado — descontinuado em 31/01/2026.)
- Evolucao por fase usando props, aura, aneis, particulas, cores e badges procedurais.
- Evitar 7 GLBs completos no primeiro ciclo.
- Manter landing procedural ate existir asset oficial/licenciado de marca.

## Tarefa para Claude Code

Produzir um plano curto antes de implementar qualquer asset real:

1. Fonte recomendada dos assets: GLBs proprios/licenciados ou hibrido (sem RPM).
2. Impacto esperado em payload, bundle e performance mobile.
3. Registry de evolucao para mapear os 7 estados.
4. Componentes sugeridos e fronteiras client/server.
5. Plano incremental de implementacao.
6. Riscos, rollback e criterios de aprovacao.

Entrega esperada: `docs/product-evolution/13-real-3d-assets-plan.md`.

## Restricoes

- Nao usar o GLB do kanguru.
- Nao baixar assets externos sem decisao/licenca explicita.
- Nao tocar em auth, XP, review, Boss Final, banco ou `src/server/*`.
- Nao substituir fallback sem manter dimensao estavel.
- Nao colocar assets pesados no caminho critico.
- Nao bloquear navegacao, leitura ou formularios por causa de 3D.

## Criterios de aceite

- First Load JS da landing permanece estavel.
- Assets 3D carregam async/lazy.
- Fallback funciona com JS desligado, WebGL indisponivel ou erro de asset.
- `prefers-reduced-motion` pausa animacao continua.
- Desktop e mobile sao validados por screenshot.
- Qualquer asset externo explicita origem, licenca, custo e dependencia operacional.
- O plano deixa claro o caminho de rollback para fallback procedural/estatico.

## Pergunta aberta

Antes de implementar, confirmar a identidade principal dos avatares:

- aluno humano;
- agente IA;
- mascote da marca;
- companheiro de jornada hibrido.

Recomendacao inicial: companheiro de jornada hibrido, com avatar humano/agentivo como base e cosmeticos procedurais de evolucao.
