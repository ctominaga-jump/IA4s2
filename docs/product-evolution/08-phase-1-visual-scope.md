# 08 - Phase 1 Visual Scope

## Objetivo da Fase 1

Reposicionar a landing page publica em `src/app/page.tsx` para comunicar, na primeira dobra, que IA para Vida Real e uma jornada gamificada premium de evolucao em IA, nao apenas uma plataforma de curso.

Esta fase nao altera o core de aluno/professor, banco, XP, submissao ou review. Ela atua na entrada publica, identidade visual inicial e narrativa.

## Escopo incluido

- Nova direcao visual para a landing.
- Copy principal reposicionada para jornada gamificada.
- Hero premium com sensacao de laboratorio/academia de agentes.
- Preview visual da jornada ate o Boss Final.
- Secao com as sete fases: Despertar, Explorador, Estrategista, Criador, Operador, Arquiteto de IA e Boss Final.
- Cards de valor: missoes praticas, feedback humano, XP/niveis, produto final.
- CTA primario: iniciar jornada/criar conta.
- CTA secundario: entrar.
- Responsividade desktop/mobile.
- Estados para usuario logado continuam apontando para o dashboard correto.

## Fora do escopo

- Alterar regras de XP.
- Alterar `src/server/*`.
- Criar avatar funcional.
- Criar skill tree funcional.
- Criar mapa interativo real.
- Instalar Three.js ou React Three Fiber.
- Criar novas tabelas.
- Alterar fluxo de onboarding.
- Alterar telas internas do aluno/professor.

## Criterios visuais de aceite

Primeira dobra:

- O H1 deve comunicar explicitamente a evolucao em IA ou jornada ate criar produto com IA.
- O usuario deve entender em ate 5 segundos que o produto e gamificado.
- Deve existir um elemento visual forte: painel/cockpit/mapa/portal/avatar ilustrativo.
- CTA primario deve estar visivel sem scroll em desktop e mobile.

Identidade:

- Visual deve parecer premium/futurista, com contraste, profundidade e energia.
- Evitar aparencia de SaaS educacional generico: cards brancos simples, hero puramente textual e grade institucional comum.
- Usar linguagem de missao, XP, niveis, fases e Boss Final.
- Manter legibilidade alta e sem excesso de efeitos.

Jornada:

- As sete fases devem aparecer com progressao clara.
- Boss Final deve aparecer como climax da jornada, nao como item comum.
- Deve haver relacao explicita entre aprender IA e construir um produto.

Performance e acessibilidade:

- Sem dependencia pesada obrigatoria na primeira entrega.
- Imagens devem ter `alt` significativo quando usadas.
- Texto deve manter contraste adequado.
- Layout mobile nao pode ter sobreposicao, corte de texto ou CTA fora da tela.
- Animações, se adicionadas, devem ser discretas e respeitar `prefers-reduced-motion`.

## Arquivos provaveis

- `src/app/page.tsx`.
- `src/app/globals.css`.
- `tailwind.config.ts`, se forem adicionados tokens visuais.
- `src/components/marketing/*`, se a landing for quebrada em componentes.
- `public/assets/images/*`, se forem usados renders/imagens.

## Checklist antes de implementar

- Rodar `npm run test`.
- Rodar `npm run typecheck`.
- Confirmar que `/`, `/login` e `/cadastro` continuam navegaveis.
- Confirmar que usuario logado ainda ve CTA para o portal correto.

