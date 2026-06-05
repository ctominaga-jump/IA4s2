# 14 - Brief: Evolution Kits dos avatares 3D

Data: 2026-06-05

## Objetivo

Criar uma evolucao visual real dos quatro avatares 3D do aluno:

- Agente Aurora
- Agente Brasa
- Agente Verdejante
- Agente Nebulosa

A evolucao deve cobrir as fases:

- Explorador
- Estrategista
- Criador
- Operador
- Arquiteto
- Boss Final

O estado Despertar continua sendo o GLB base com camadas procedurais leves ja
existentes. As novas evolucoes devem ser construidas como **Evolution Kits**:
acessorios, placas, halos, badges, wireframes, materiais e props modulares
criados no Blender e aplicados sobre o GLB base de cada identidade.

## Principios

- O GLB base de identidade nao deve ser substituido por fase.
- Cada kit deve acrescentar maturidade visual sem descaracterizar o avatar.
- Cada avatar deve manter seu arquetipo:
  - Aurora: tecnologia calma, clareza, foco premium.
  - Brasa: energia, acao, decisao, intensidade sem agressividade.
  - Verdejante: crescimento, aprendizagem, metodo, acolhimento.
  - Nebulosa: criatividade, estrategia, sofisticacao, exploracao.
- As camadas atuais da aplicacao, como aura, aneis, particulas e coroa
  procedural, podem continuar existindo, mas devem ser harmonizadas com os kits.
- O resultado deve ser legivel em cards pequenos de UI, em torno de 150-184 px.
- Evitar texto, logos, armas, rosto humano realista, fantasia generica, excesso
  de detalhe fino e particulas pesadas dentro do GLB.

## Formato recomendado

Preferencia inicial:

- Um GLB base por avatar ja existente em `public/assets/3d/`.
- Um GLB de kit por avatar/fase, por exemplo:
  - `avatar-aurora-kit-explorador.glb`
  - `avatar-aurora-kit-estrategista.glb`
  - `avatar-aurora-kit-criador.glb`
  - `avatar-aurora-kit-operador.glb`
  - `avatar-aurora-kit-arquiteto.glb`
  - `avatar-aurora-kit-boss-final.glb`

Alternativa aceitavel se for mais eficiente:

- Um GLB unico por avatar com colecoes/nodes nomeados por fase.

Qualquer decisao deve ser registrada com criterio de payload, simplicidade de
integracao, rollback e manutencao.

## Idealizacao por avatar

### Aurora

Arquetipo: agente tecnologico calmo, claro, confiavel, curioso e focado.

- Explorador: visor ciano mais aberto; pequeno modulo de bussola holografica no
  peito; um anel orbital fino e limpo.
- Estrategista: placas violetas discretas nos ombros; linhas de circuito no
  torso; badge geometrico de plano flutuando atras.
- Criador: maos com brilho de prototipagem; microcubos ou hologramas ciano ao
  redor; visor com pulso suave.
- Operador: linhas finas de automacao nos bracos; dois trilhos orbitais como
  fluxo de tarefas; luzes sequenciais no peito.
- Arquiteto: wireframe estrutural ao redor do corpo; ombreiras minimalistas;
  aneis tecnicos como blueprint 3D.
- Boss Final: halo ciano-violeta contido; pequena coroa orbital; corpo com
  acabamento mais acetinado e emissivo, sem virar fantasia.

### Brasa

Arquetipo: agente de energia e acao, dinamico, corajoso e motivador.

- Explorador: postura visual mais ativa; anel ambar inclinado como trajetoria;
  visor com brilho quente.
- Estrategista: placas vermelho-rosa nos ombros e peito; linhas em formato de
  setas ou rotas; badge tatico triangular.
- Criador: faiscas estilizadas, nao chamas realistas; maos com glow de forja ou
  prototipo; modulos laterais mais robustos.
- Operador: bracos com trilhas de execucao; luzes ambar em sequencia; aneis
  orbitais mais rapidos e angulares.
- Arquiteto: exoestrutura leve com formas triangulares arredondadas; wireframe
  quente como matriz de decisao.
- Boss Final: coroa orbital ambar com pontas curtas; particulas ambar e rosa;
  silhueta mais heroica, mas ainda amigavel.

### Verdejante

Arquetipo: agente de crescimento e aprendizagem, paciente, organico e metodico.

- Explorador: anel verde com pequenos nos de progresso; visor sereno; detalhe
  de broto tecnologico abstrato no peito.
- Estrategista: placas em camadas suaves, lembrando folhas sem serem literais;
  linhas ciano de planejamento.
- Criador: pequenos modulos organicos/geometrizados ao redor; glow verde nas
  maos; holograma de prototipo em forma de grade viva.
- Operador: trilhas de automacao como veios luminosos nos bracos e torso;
  particulas ordenadas em fluxo.
- Arquiteto: wireframe ciano-verde como laboratorio modular; ombros com placas
  curvas mais maduras.
- Boss Final: halo verde com acentos ambar; coroa orbital pequena como ciclo
  completo; sensacao de mestre mentor, sem parecer arvore ou planta literal.

### Nebulosa

Arquetipo: agente de criatividade e estrategia, imaginativo, sereno,
sofisticado e exploratorio.

- Explorador: anel violeta levemente assimetrico; visor amplo com brilho
  profundo; particulas rosa bem espacadas.
- Estrategista: segundo anel rosa como orbita de planejamento; badge abstrato
  tipo constelacao tatica, sem estrelas literais no corpo.
- Criador: hologramas fragmentados ao redor das maos; placas suaves com
  assimetria sutil; material violeta mais iridescente.
- Operador: linhas de automacao como caminhos orbitais; pequenos nos luminosos
  conectando aneis; pulso ritmado no visor.
- Arquiteto: wireframe elegante em camadas, como malha de sistema; aneis com
  inclinacoes diferentes compondo estrategia espacial.
- Boss Final: halo violeta-rosa com acento ambar; coroa orbital minimalista;
  particulas mais densas, mas controladas e premium.

## Integracao esperada

- Criar um registry explicito de kits por `variant` e fase.
- Carregar kits de forma lazy, sem colocar GLBs no bundle JS.
- Manter fallback 2D e rollback por variante/fase.
- Criar preview que permita comparar:
  - 4 identidades base;
  - 7 estados de um avatar selecionado;
  - pelo menos uma visao de matriz 4 x 7, se performance permitir.
- Respeitar reduced motion: rotacoes e particulas animadas devem congelar.
- Em caso de erro de asset, apenas o card afetado deve cair para fallback.

## Orcamento e validacao

- Kit individual ideal: pequeno, preferencialmente abaixo de 150-300 KB quando
  possivel.
- O conjunto base + kit por avatar/fase deve mirar o envelope mobile ja
  documentado nos relatorios GLB.
- Antes de plugar em cockpit/perfil, validar no preview.
- Rodar:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
- Gerar screenshots desktop e mobile do preview.
- Gerar renders ou capturas do Blender quando necessario para revisar
  silhueta, escala e clipping.

## Criterios de aceite

- Cada fase parece uma evolucao real, nao apenas aumento de particulas.
- Cada avatar preserva identidade e arquetipo.
- Nenhum avatar vira recolor de outro.
- Os kits nao quebram escala, centro, orientacao ou legibilidade.
- O preview mostra fallback e reduced motion funcionando.
- Os assets finais estao documentados com comandos, pesos, triangulos e riscos.
