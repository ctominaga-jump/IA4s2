# 02 - New Product Vision

## Posicionamento

IA para Vida Real deve evoluir de um portal de missoes praticas para uma experiencia gamificada premium de evolucao em IA.

Posicionamento proposto:

> Um jogo de evolucao pessoal em IA, no qual o aluno sai do zero, aprende a pensar com ferramentas inteligentes e chega ao Boss Final criando seu proprio produto com IA.

O produto nao deve parecer um LMS. Deve parecer uma academia de agentes, um laboratorio futurista e um RPG de carreira/aprendizado, mantendo a seguranca pedagogica do fluxo atual: missao, entrega, feedback e evolucao.

## Proposta de valor

- Transformar IA em habilidade pratica, nao apenas conteudo teorico.
- Dar ao aluno uma jornada clara, visual e recompensadora.
- Converter cada aula em missao com entrega concreta.
- Usar feedback humano como validacao de progresso.
- Levar o aluno ate um projeto final: produto com IA, documentado e apresentavel.

## Publico-alvo inicial

- Iniciantes em IA que precisam de uma trilha guiada.
- Estudantes e profissionais que querem aplicar IA no estudo, trabalho, criacao e produtividade.
- Pessoas com medo de ferramentas tecnicas, mas motivadas por desafios praticos.
- Alunos que se beneficiam de progressao visual, recompensas e feedback humano.

## Tom visual

- Futurista, mas claro.
- Premium, mas nao frio.
- Energetico, mas legivel.
- Com sensacao de laboratorio/academia, nao de plataforma corporativa tradicional.
- Hologramas, mapas, paineis, glow controlado, profundidade e microinteracoes.

## Sensacao desejada

O aluno deve sentir:

- "Estou entrando em uma jornada."
- "Meu progresso tem forma visivel."
- "Cada missao desbloqueia uma capacidade real."
- "Nao estou sozinho; ha validacao e orientacao."
- "O final da jornada e construir algo meu."

## Curso tradicional vs jornada gamificada

Curso tradicional:

- Modulos e aulas lineares.
- Conteudo antes de acao.
- Progresso como porcentagem.
- Pouca identidade do aluno.
- Final muitas vezes abstrato.

Jornada gamificada:

- Fases narrativas com objetivos claros.
- Missao pratica desde o inicio.
- XP, niveis, badges, skill tree e checkpoints.
- Avatar e perfil de evolucao.
- Boss Final com produto real.
- Feedback humano como avaliacao de missao.

## Pilares do produto

1. Jornada epica e clara

Cada fase deve responder: o que desbloqueio aqui, por que importa e qual prova pratica demonstra que aprendi.

2. Aprender fazendo

O loop atual de missao -> entrega -> feedback -> XP deve continuar sendo o coracao do produto.

3. Progresso visivel

XP, nivel, mapa, skill tree, badges e avatar devem tornar a evolucao tangivel.

4. Autonomia com IA

O aluno aprende a usar IA para pensar, validar, construir e decidir, nao apenas copiar respostas.

5. Produto final

O Boss Final deve transformar aprendizado em portfolio: problema, solucao, arquitetura, prototipo e validacao.

6. Premium com performance

Motion e 3D devem aumentar percepcao de valor sem prejudicar carregamento, acessibilidade ou fluxo principal.

## Implicacoes para a aplicacao atual

- A landing em `src/app/page.tsx` precisa ser reposicionada como entrada cinematografica da jornada.
- O dashboard do aluno em `src/app/aluno/page.tsx` deve virar cockpit de progresso, com mapa, avatar e proxima missao.
- A lista de missoes em `src/app/aluno/missoes/page.tsx` deve virar mapa/fases da jornada.
- O perfil em `src/app/aluno/perfil/page.tsx` deve virar identidade do agente/aluno, com conquistas, habilidades e diario.
- O modelo de dados deve evoluir de curso/modulo/missao para fases, skills, badges concedidas, checkpoint e projeto final.
- A area do professor deve continuar funcional e densa, mas pode ganhar linguagem de "validacao de missoes".

