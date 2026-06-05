# 15 - Design spec: Evolution Kits (Avatar Art Director)

Data: 2026-06-05 · Fase: Evolution Kits dos avatares 3D
Fontes: brief 14, briefs JSON dos 4 avatares, plano/decisão 13, GLBs base em `public/assets/3d/`.

## Decisão de ferramenta (registrada pelo orquestrador)

O Blender não está disponível neste ambiente (já registrado nos relatórios de
Brasa/Verdejante/Nebulosa). Os kits são gerados por **script Node reproduzível**
com `@gltf-transform/core` (já devDependency, mesmo pipeline do
`glb-isolate-center.mjs`). O brief 14 aceita "Blender por script **ou fluxo
reproduzível**". Toda a geometria dos kits é paramétrica (anéis, placas, halos,
badges, frames), o que torna a autoria por código mais precisa e auditável que
modelagem manual. Uma passada futura de polish no Blender permanece possível —
os GLBs de kit são independentes dos GLBs base.

## Convenções técnicas (contrato com o Kit Artist e o GLB Engineer)

- **Espaço de autoria = espaço do GLB base**: Y-up, origem no centro do avatar,
  avatar ocupa Y ∈ [-0.5, +0.5] (altura 1.0). O app escala base + kit juntos
  (×1.9) dentro do mesmo grupo de spin/float — o kit acompanha o avatar.
- Referências de anatomia (bbox Aurora; os 4 GLBs seguem a mesma normalização):
  topo da cabeça Y ≈ +0.50 · linha do visor Y ≈ +0.32 · ombros Y ≈ +0.22,
  X ≈ ±0.20 · peito Y ≈ +0.10 · quadril Y ≈ -0.15 · X máx corpo ≈ ±0.29,
  Z máx ≈ ±0.21.
- **Anéis de kit**: raio 0.42–0.62 (mundo 0.80–1.18 após ×1.9) — aninham por
  DENTRO dos anéis procedurais (r 1.25+ no espaço do grupo externo), sem colidir.
- **Halo/coroa de kit**: Y +0.58–0.70. A coroa procedural do Boss (y=1.15 no
  espaço externo ≈ acima da cabeça) é SUPRIMIDA quando o kit Boss Final carrega
  (harmonização; ver integração) — evita coroa dupla.
- Sem câmeras, luzes, animações, skins ou texturas no kit. Materiais PBR por
  fator (baseColor/metallic/roughness/emissive) — peso mínimo, sem decoder.
- Nomes estáveis: root `Kit_<Avatar>_<Fase>`, filhos `kit_<avatar>_<fase>_<modulo>NN`.
- Orçamento por kit: **≤ 8k triângulos, ≤ 150 KB** (ideal < 60 KB).
- Proibido (briefs): texto, logos, armas, chamas realistas, rosto/cabelo
  humano, estrela/galáxia literal, folha/planta literal, detalhe fino ilegível
  em 150 px.

## Gramática de formas por avatar (anti-recolor)

A diferenciação NÃO é só paleta — cada avatar tem vocabulário geométrico próprio:

| Avatar | Placas | Anéis | Nós/acentos | Assinatura |
|---|---|---|---|---|
| Aurora | hexagonais, planas, simétricas | círculos perfeitos, tube fino | discos/hex, espaçamento uniforme | precisão calma, blueprint |
| Brasa | chevrons/triângulos suavizados | inclinados 15–25°, seção mais grossa | setas/tetraedros | trajetória, energia direcionada |
| Verdejante | pares curvos em camadas (pétala abstrata, nunca folha literal) | com nós de progresso esféricos | esferas/brotos geométricos | crescimento em ciclos |
| Nebulosa | suaves com assimetria sutil (um lado maior) | multi-inclinação, raios distintos | fragmentos/shards, clusters | constelação tática abstrata |

Paletas (briefs JSON): Aurora ciano `#16D9E3` + violeta `#6D5DF7` · Brasa âmbar
`#FFC857` + rosa `#FF5C7A` · Verdejante verde `#3EE58F` + ciano `#16D9E3` ·
Nebulosa violeta `#6D5DF7` + rosa `#FF5C7A`. Neutro escuro por avatar para
partes não emissivas (`neutral_mid` do brief). Boss Final pode usar âmbar
`#FFC857` como acento de recompensa (todos).

## Linguagem de maturidade por fase (igual para os 4, expressa na gramática de cada um)

1. **Explorador — descoberta**: 1 anel orbital fino + módulo de instrumento no
   peito + acento de visor. Pouca massa, leitura "primeiro passo".
2. **Estrategista — planejamento**: placas de ombro (par) + badge geométrico
   flutuando atrás (Z negativo) + segundo anel fino. Primeiro "equipamento".
3. **Criador — prototipagem**: módulos/protótipos flutuantes na altura das mãos
   (Y ≈ -0.05, X ±0.34) + cuffs emissivos nos pulsos + módulo lateral. Massa
   média, energia de construção.
4. **Operador — automação**: trilhos nos braços + sequência de luzes no peito
   (3 nós) + 2 trilhos orbitais. Sensação de fluxo/execução.
5. **Arquiteto — estrutura**: gaiola wireframe estrutural (arestas como tubos
   finos — glTF não tem material wireframe) + ombreiras maduras + anel técnico
   com ticks. Maior presença, ainda legível.
6. **Boss Final — culminação**: halo + coroa orbital pequena + núcleo de peito
   + caps de ombro. Máxima maturidade SEM fantasia genérica; paleta própria +
   acento âmbar de recompensa.

Progressão de massa visual aproximada (tris): 1.2k → 2.2k → 2.8k → 3.2k → 4.5k → 5.5k.

## Os 24 kits

### Aurora (tecnologia calma, clareza premium)

- **Explorador**: anel ciano perfeito r0.50 horizontal; bússola holográfica no
  peito (disco hex + agulha) Y+0.10 Z+0.20; barra fina de visor ciano.
- **Estrategista**: placas hex violeta nos ombros; 2 linhas de circuito
  (strips finos) no torso; badge hex duplo (hex externo + hex interno emissivo)
  flutuando atrás Z-0.34 Y+0.25.
- **Criador**: 4 microcubos ciano orbitando as mãos; cuffs emissivos nos
  pulsos; strip de visor com nós de pulso (3 discos).
- **Operador**: linhas finas de automação nos braços (strips verticais); 2
  trilhos orbitais r0.48/r0.58 (tilt 8°); 3 luzes sequenciais no peito.
- **Arquiteto**: gaiola icosaédrica de arestas-tubo ciano r0.55; ombreiras hex
  minimalistas; anel blueprint r0.62 com 4 ticks violeta.
- **Boss Final**: halo duplo ciano+violeta Y+0.62; coroa orbital (anel r0.16 +
  5 prismas curtos) Y+0.56; núcleo de peito acetinado emissivo; caps de ombro.

### Brasa (energia e ação, intensidade amigável)

- **Explorador**: anel âmbar inclinado 22° (trajetória) r0.50; módulo seta no
  peito (chevron); brilho quente de visor.
- **Estrategista**: chevrons vermelho-rosa nos ombros e peito; 3 strips em
  rota/seta no torso; badge triangular tático atrás (tri externo + tri interno).
- **Criador**: 4 faíscas estilizadas (tetraedros âmbar, NÃO chamas) nas mãos;
  cuffs de forja; módulos laterais robustos no quadril (boxes chanfrados).
- **Operador**: trilhas de execução nos braços (strips duplos); 2 anéis
  angulares rápidos r0.46/r0.56 (tilt 18°/-14°, seção hex); 3 luzes âmbar.
- **Arquiteto**: exoestrutura octaédrica (arestas-tubo, formas triangulares
  arredondadas) r0.55 quente; ombreiras triângulo-arredondado; anel matriz
  r0.60 com 3 setas.
- **Boss Final**: coroa âmbar de pontas curtas (5 cones baixos) Y+0.56; halo
  âmbar-rosa inclinado 10°; caps heroicos de ombro; núcleo de peito quente.

### Verdejante (crescimento e método, organicidade geométrica)

- **Explorador**: anel verde r0.50 com 5 nós esféricos de progresso; broto
  tecnológico abstrato no peito (3 esferas empilhadas decrescentes); visor sereno.
- **Estrategista**: pares de placas curvas em camadas nos ombros (2 níveis,
  pétala abstrata); 2 linhas ciano de planejamento no torso; badge circular em
  camadas atrás (2 discos concêntricos).
- **Criador**: 4 pods icosa verde nas mãos; grade viva (lattice 3×3 de tubos
  finos) flutuando ao lado X+0.36; cuffs verdes.
- **Operador**: veios luminosos (strips curvos aproximados) braços e torso;
  anel de fluxo r0.52 com 8 nós ordenados; 3 luzes de peito.
- **Arquiteto**: gaiola modular box-frame ciano-verde (laboratório) r0.52;
  placas curvas maduras nos ombros (3 camadas); anel técnico r0.60.
- **Boss Final**: halo verde Y+0.62 com 4 nós âmbar alternados; coroa-ciclo
  (anel r0.16 + 5 esferas, ciclo completo — mestre mentor); núcleo de peito;
  caps curvos.

### Nebulosa (criatividade e estratégia, sofisticação espacial)

- **Explorador**: anel violeta r0.52 levemente assimétrico (tilt 12° + offset
  X 0.04); 3 nós rosa bem espaçados; acento amplo de visor.
- **Estrategista**: segundo anel rosa r0.58 em órbita própria (tilt -20°);
  badge constelação tática atrás (4 esferas pequenas ligadas por tubos finos,
  abstrato — fora do corpo, conforme brief); placas suaves assimétricas.
- **Criador**: 5 shards holográficos fragmentados (tetra achatados) ao redor
  das mãos; placas iridescentes (metallic alto, roughness baixo); cuffs violeta.
- **Operador**: 2 caminhos orbitais r0.48/r0.58 (tilts 15°/-25°) com 6 nós
  luminosos conectando; barra de pulso no visor.
- **Arquiteto**: malha elegante em camadas — 3 anéis r0.50/0.56/0.62 com
  inclinações distintas compondo sistema + frame icosa parcial; ombreiras
  assimétricas sutis.
- **Boss Final**: halo violeta-rosa Y+0.62 com 1 nó âmbar de acento; coroa
  orbital minimalista (anel fino + 4 prismas); clusters de nós densos mas
  controlados; núcleo de peito premium.

## Harmonização com camadas procedurais (contrato com o Executor)

- Anéis/partículas procedurais por fase CONTINUAM (AVATAR_STATES intocado).
- Coroa procedural do Boss é suprimida quando o kit Boss Final estiver ativo
  (kit já entrega halo+coroa desenhados); rollback do kit restaura a coroa.
- Kits carregam lazy (useGLTF + Suspense) DENTRO do grupo spin/float, com a
  mesma escala/rotação do modelo base.

## Critérios de aceite do Art Director

- Nenhum kit é recolor de outro avatar (gramática de formas distinta).
- Evolução legível em 150 px: silhueta muda a cada fase (massa, posição, coroa).
- Identidade preservada: kit nunca cobre o visor nem o centro do corpo.
- Boss Final = culminação premium contida, não fantasia.

Decisão: **spec aprovada para geração** (validação visual final por screenshot
após integração).
