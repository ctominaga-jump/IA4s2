# 04 - Visual Direction

## Direcao geral

A interface deve migrar de "portal educacional limpo" para "cockpit premium de evolucao em IA".

Palavras-chave:

- laboratorio futurista;
- academia de agentes;
- dashboard premium;
- RPG de progressao;
- holograma;
- mapa de jornada;
- avatar evolutivo;
- skill tree;
- boss final.

## Estado visual atual

O tema atual em `src/app/globals.css` usa fundo claro, cards brancos, primario violeta/indigo, muteds claros e bordas suaves. E limpo e legivel, mas ainda proximo de SaaS educacional padrao.

Componentes como `Card`, `Badge`, `Button`, `Alert` e `AppShell` sao bons para base, mas precisam de nova camada de identidade.

## Paleta sugerida

Base premium clara/escura adaptavel:

- Background escuro principal: `#070A12`.
- Surface: `#0E1424`.
- Surface elevada: `#141B2E`.
- Texto principal: `#F4F7FB`.
- Texto secundario: `#A7B0C0`.
- Primario energia: `#6D5DF7`.
- Ciano holografico: `#16D9E3`.
- Verde progresso: `#3EE58F`.
- Ambar recompensa: `#FFC857`.
- Vermelho alerta: `#FF5C7A`.

Recomendacao: introduzir dark premium primeiro nas areas publicas e do aluno. A area do professor pode continuar mais clara/densa ate haver novo design especifico.

## Tipografia sugerida

- Sans principal: Inter, Geist ou Satoshi.
- Display/hero: Space Grotesk, Orbitron ou Exo 2 com uso moderado.
- Numeros/metricas: usar `tabular-nums` e pesos fortes.

Evitar excesso de fonte "tech" em textos longos. A fantasia futurista deve vir mais de composicao, movimento, profundidade e microcopy do que de fonte decorativa.

## Referencias de interface

Direcoes a pesquisar/inspirar:

- Dashboards premium com paineis densos e contraste alto.
- Game UI de progressao: mapas, missao ativa, recompensas, level up.
- Academias/laboratorios sci-fi com paineis, linhas de conexao e hologramas.
- 21st.dev para acelerar padroes de componentes modernos.
- Repos/conceitos como `ui-ux-pro-max` para direcao de polimento, sem copiar indiscriminadamente.

## Uso de 3D

Usar 3D para valor perceptivo, nao como dependencia do fluxo principal.

Prioridades:

1. Landing: cena hero com laboratorio/portal/avatar ou arte 3D renderizada.
2. Dashboard aluno: avatar ou nucleo/holograma leve.
3. Jornada: mapa 3D/isometrico ou background com profundidade.
4. Boss Final: cena especial de "produto sendo construido".

Tecnologia sugerida:

- Curto prazo: imagens geradas/renderizadas e video leve.
- Medio prazo: Three.js + React Three Fiber + Drei em componentes isolados.
- Longo prazo: assets GLB/GLTF com lazy loading e fallback estatico.

Fontes de assets:

- Ready Player Me para avatar.
- Sketchfab, CGTrader, KitBash3D e BlenderKit para props/laboratorio.
- Blender para compactar, limpar materiais e gerar LOD quando necessario.

## Uso de motion

Framer Motion deve ser usado para:

- entrada da landing;
- transicoes de cards;
- hover/tap de missoes;
- celebracao de XP;
- level up;
- unlock de badge/skill;
- transicoes de fases no mapa.

Evitar animar grandes listas sem necessidade. Usar `prefers-reduced-motion`.

## Landing

Arquivo atual: `src/app/page.tsx`.

Mudanca desejada:

- H1 com promessa literal: "IA para Vida Real" ou "Desbloqueie sua evolucao em IA".
- Hero cinematografico com visual de laboratorio/portal/avatar.
- CTA: "Iniciar jornada".
- Preview do mapa, avatar, XP e Boss Final.
- Secao "Do zero ao produto com IA".
- Secao das sete fases.
- Prova de valor: missoes, feedback humano, progresso e projeto final.

## Dashboard do aluno

Arquivo atual: `src/app/aluno/page.tsx`.

Transformar em cockpit:

- Avatar/nivel em destaque.
- Proxima missao como card principal.
- Mapa compacto da jornada.
- XP, fase atual e skills desbloqueadas.
- Feedback recente como "transmissoes do mentor".
- Objetivo real como "contrato de jornada".

## Jornada / mapa

Arquivo atual: `src/app/aluno/missoes/page.tsx`.

Transformar lista linear em:

- mapa por fases;
- nos de missao com status visual;
- bloqueios/desbloqueios;
- recompensa visivel;
- boss final no fim da trilha;
- alternativa acessivel em lista para mobile/leitores de tela.

## Avatar

Locais:

- Dashboard;
- Perfil;
- Header do aluno;
- modal de level up;
- pagina de boss final.

Estados:

- Iniciante;
- Explorador;
- Estrategista;
- Criador;
- Operador;
- Arquiteto;
- Mestre do Boss Final.

## Cards, missoes e skill tree

Cards de missao devem exibir:

- fase;
- status;
- skill treinada;
- XP;
- dificuldade;
- tempo estimado;
- criterio de aceite.

Skill tree:

- ramos por habilidade;
- linhas/conexoes;
- nos desbloqueados;
- tooltip com missoes relacionadas;
- estado bloqueado, disponivel, em validacao, completo.

