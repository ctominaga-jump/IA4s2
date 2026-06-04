# 13 - Decisao: fonte dos avatares 3D reais

## Atualizacao (2026-06-02): Ready Player Me descontinuado

O Ready Player Me (RPM) foi oficialmente descontinuado em 31/01/2026. **Nao vamos
seguir com RPM** — nao ha integracao a implementar, e nao usamos URLs de placeholder
do RPM em nenhum lugar.

O pipeline continua **plugavel** (o plug point `modelUrl` aceita qualquer GLB). O novo
caminho do avatar base e:

- **GLBs proprios/licenciados** de uma fonte estavel a definir; ou
- **avatar procedural/hibrido interno** ate escolhermos essa fonte.

As secoes abaixo refletem a decisao original (hibrido) menos a dependencia de RPM.

## Decisao

Escolher a opcao 3: hibrido.

O caminho recomendado e usar um avatar base real/programatico — GLB proprio/licenciado
de uma fonte estavel — combinado com efeitos e props procedurais por fase. Enquanto a
fonte estavel nao for escolhida, o avatar base permanece procedural/interno.

## Por que nao depender de uma plataforma de avatar externa

Uma plataforma de avatar externa destrava rapido, mas sozinha pode deixar a identidade
visual muito generica e dependente da estetica da plataforma — alem do risco de
descontinuacao (como aconteceu com o RPM). O produto precisa parecer "IA para Vida
Real", nao apenas um viewer de avatar.

## Por que nao escolher apenas GLBs proprios/marketplace agora

GLBs proprios dao mais controle visual, mas criam dependencia imediata de sourcing,
licenca, otimizacao, LOD, fallback e manutencao. Para 7 estados, o risco de peso e
retrabalho e alto demais para o proximo ciclo.

## Por que hibrido

O hibrido equilibra velocidade, identidade e performance:

- usa um avatar base para dar presenca real;
- preserva identidade da marca com aura, aneis, particulas, badges e props;
- evita 7 modelos pesados no primeiro ciclo;
- reaproveita o envelope tecnico validado na 7B;
- permite evoluir visualmente fase a fase sem mexer nas regras de XP.

## Direcao dos 7 estados

Os 7 estados devem ser representados por camadas visuais, nao por 7 modelos completos
no primeiro momento:

1. Despertar: aura leve, ciano baixo, um no orbital.
2. Explorador: anel mais claro, dois nos, micro-particulas.
3. Estrategista: violeta entra no anel, badge de plano.
4. Criador: prop de construcao/prototipo, brilho verde de progresso.
5. Operador: linhas de automacao, aura mais densa.
6. Arquiteto: wireframe/estrutura ao redor do avatar.
7. Boss Final: coroa/halo final, ambar de recompensa e efeito especial contido.

## Condicoes para implementar

Antes de implementar asset real em producao, e necessario ter uma destas entradas:

- GLB proprio/licenciado com origem clara, de uma fonte estavel; ou
- decisao explicita de manter tudo procedural ate a direcao visual estar fechada.

## Resposta para o prompt do Claude Code

Selecionar:

> 3. Hibrido

Complemento (revisado em 2026-06-02, pos-descontinuacao do RPM):

> Vamos seguir com hibrido. O avatar base sera um GLB proprio/licenciado de uma fonte estavel a definir — **nao** usar Ready Player Me (descontinuado em 31/01/2026) nem implementar integracao com ele, e **nao** usar URLs de placeholder. Ate termos a fonte estavel, o avatar base permanece procedural/interno. A evolucao dos 7 estados vem primeiro por camadas procedurais: aura, aneis, particulas, cores, badges e props. O GLB do kanguru foi apenas teste isolado e nao deve ser usado no produto. O plano de arquitetura, registry dos estados, impacto de payload/performance, riscos e criterios de rollback esta em `docs/product-evolution/13-real-3d-assets-plan.md`.
