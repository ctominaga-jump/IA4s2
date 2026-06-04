# Prompts de geracao dos avatares 3D

Data: 2026-06-02

Este documento transforma os briefs JSON em prompts executaveis para gerar os
avatares que ainda nao existem como GLB proprio: **Agente Brasa**, **Agente
Verdejante** e **Agente Nebulosa**.

## Regra principal

Somente o **Agente Aurora** possui GLB real no repositorio hoje:

- `public/assets/3d/avatar-aurora.glb`

Os demais agentes devem ser gerados como **modelos base proprios**, com
silhueta, materiais e identidade diferentes. Eles podem compartilhar a linguagem
visual do produto, mas **nao devem usar o GLB da Aurora como source mesh,
reference mesh, base model ou recolor**.

## Prompt base comum

Use este bloco junto com o bloco especifico de cada agente:

```text
Create a clean game-ready stylized 3D character for a learning platform about AI.
The character is a small friendly AI learning companion, compact humanoid,
slightly larger head, small body, simple hands without detailed fingers, readable
at small UI sizes, premium but approachable.

Use simple symmetrical geometry, clean rounded sci-fi shapes, matte dark polymer,
satin dark metal, abstract visor with no realistic human face, neutral A-pose,
centered model, front facing, white or transparent studio background.

Important production constraints: generate a new original base model. Do not use
the Aurora GLB as source mesh, reference mesh, base model, or recolor. Keep this
agent visually related to the same product family, but give it a distinct
silhouette and distinct material/color identity.

No text, no logo, no weapons, no realistic human face, no realistic hair, no
particles, no aura, no floating rings, no complex background, no tiny fragile
details.
```

## Agente Brasa

### Concept / turnaround prompt

```text
Create a front, side, and back orthographic turnaround sheet for Agente Brasa, a
stylized 3D character concept.

Agente Brasa is an energetic AI learning companion: dynamic, brave, direct,
motivating, intense without being aggressive. The silhouette is compact and
athletic, with a subtle ready-for-action posture while still staying neutral and
non-combat. Use softened triangular forms, curved armor plates, contained energy
lines, simple strong volumes.

Color palette: amber primary #FFC857, red-pink secondary #FF5C7A, warm dark
neutral #141018, mid dark #2A1824. Materials: matte warm graphite polymer,
amber emissive glass visor, satin dark metal, discreet red-pink accents.

Avoid realistic flames, aggressive expression, combat pose, weapons, text,
logos, realistic human face, realistic hair, particles, aura, floating rings,
complex background, and overly fine details.
```

### GLB generation prompt

```text
Clean game-ready stylized GLB character: Agente Brasa, a small friendly AI
learning companion with compact energetic humanoid silhouette. Neutral symmetric
A-pose, front facing, readable at small UI sizes.

Use softened triangular sci-fi shapes, curved warm graphite armor plates, matte
dark polymer body, satin dark metal joints, amber emissive abstract visor and
small red-pink accent lines. The character should feel dynamic and motivating,
but not aggressive and not combat-oriented.

Generate a new original base model, not a recolor or mesh edit of Aurora. No
particles, no aura, no floating rings, no realistic flames, no weapons, no text,
no logo, no realistic human face, no realistic hair, no complex background.
```

## Agente Verdejante

### Concept / turnaround prompt

```text
Create a front, side, and back orthographic turnaround sheet for Agente
Verdejante, a stylized 3D character concept.

Agente Verdejante is a growth-oriented AI learning companion: patient,
optimistic, organic, welcoming, methodical. The silhouette is compact and soft,
with rounded contours, slightly larger head, small body, and simple hands. Use
rounded forms, clean curves, subtle leaf-inspired plates without becoming a
literal plant or tree, and discreet luminous progress details.

Color palette: green primary #3EE58F, cyan secondary #16D9E3, dark green neutral
#0E1A18, mid dark green #17302B. Materials: matte dark green polymer, green
emissive glass visor, satin dark metal, discreet cyan accents.

Avoid literal tree/plant body, excessive realistic leaves, weapons, text, logos,
realistic human face, realistic hair, particles, aura, floating rings, complex
background, and overly fine details.
```

### GLB generation prompt

```text
Clean game-ready stylized GLB character: Agente Verdejante, a small friendly AI
learning companion with compact soft humanoid silhouette. Neutral symmetric
A-pose, front facing, readable at small UI sizes.

Use rounded sci-fi geometry, soft clean contours, subtle leaf-inspired armor
plates that remain technological and abstract, matte dark green polymer body,
satin dark metal joints, green emissive abstract visor, discreet cyan accents.
The character should feel patient, welcoming, optimistic, and growth-oriented.

Generate a new original base model, not a recolor or mesh edit of Aurora. No
literal tree or plant body, no excessive realistic leaves, no particles, no aura,
no floating rings, no weapons, no text, no logo, no realistic human face, no
realistic hair, no complex background.
```

## Agente Nebulosa

### Concept / turnaround prompt

```text
Create a front, side, and back orthographic turnaround sheet for Agente
Nebulosa, a stylized 3D character concept.

Agente Nebulosa is a creative and strategic AI learning companion: imaginative,
strategic, serene, sophisticated, exploratory. The silhouette is compact and
elegant, with a slightly larger head, small body, simple hands, subtle soft
asymmetry, smooth plates, broad abstract visor, and discreet luminous details.

Color palette: violet primary #6D5DF7, pink secondary #FF5C7A, dark violet
neutral #111025, mid dark violet #211A3A. Materials: matte dark violet polymer,
violet emissive glass visor, satin dark metal, discreet pink accents.

Avoid literal stars or galaxy textures on the body, overly mystical fantasy
look, weapons, text, logos, realistic human face, realistic hair, particles,
aura, floating rings, complex background, and overly fine details.
```

### GLB generation prompt

```text
Clean game-ready stylized GLB character: Agente Nebulosa, a small friendly AI
learning companion with compact elegant humanoid silhouette. Neutral symmetric
A-pose, front facing, readable at small UI sizes.

Use smooth sci-fi plates, subtle soft asymmetry, broad abstract visor, matte dark
violet polymer body, satin dark metal joints, violet emissive glass elements,
discreet pink accents. The character should feel imaginative, serene,
sophisticated, and strategic, with a premium exploratory tone.

Generate a new original base model, not a recolor or mesh edit of Aurora. No
literal stars or galaxy textures, no mystical fantasy styling, no particles, no
aura, no floating rings, no weapons, no text, no logo, no realistic human face,
no realistic hair, no complex background.
```

## Checklist de aceite para cada GLB

- Origem/licenca documentada.
- Modelo original, nao derivado do GLB da Aurora.
- Altura normalizada e centrado na origem.
- Frente consistente com o viewer atual.
- Legivel entre 150 px e 184 px.
- Sem particulas, aura ou aneis no arquivo base; esses elementos continuam
  procedurais na aplicacao.
- Peso alvo: abaixo de 1 MB quando possivel; aceitavel ate poucos MB se houver
  ganho visual claro.
- Testar no preview antes de plugar no produto vivo.
