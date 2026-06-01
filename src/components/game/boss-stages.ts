import {
  FlaskConical,
  Hammer,
  Layers,
  Lightbulb,
  Target,
  type LucideIcon,
} from "lucide-react";

import type { BossProjectRow } from "@/lib/database.types";

/** Chaves das etapas do projeto final (colunas de boss_projects). */
export type BossStageKey =
  | "problem"
  | "solution"
  | "architecture"
  | "prototype"
  | "validation";

export interface BossStageMeta {
  key: BossStageKey;
  number: number;
  label: string;
  /** Resumo curto exibido como subtitulo da etapa. */
  summary: string;
  /** Perguntas-guia para o aluno preencher a etapa. */
  prompt: string;
  placeholder: string;
  icon: LucideIcon;
}

/**
 * As 5 etapas do Boss Final, na ordem narrativa (problema -> validacao).
 * Compartilhada entre o hub do aluno e a tela de avaliacao do professor.
 * Conecta-se diretamente as missoes da fase Arquiteto (Fase 5).
 */
export const BOSS_STAGES: BossStageMeta[] = [
  {
    key: "problem",
    number: 1,
    label: "Problema",
    summary: "Que dor real voce vai resolver com IA?",
    prompt:
      "Descreva o problema real, quem sofre com ele e por que vale a pena resolver. Seja concreto.",
    placeholder:
      "Ex.: Pequenos comerciantes perdem tempo respondendo as mesmas duvidas no WhatsApp...",
    icon: Target,
  },
  {
    key: "solution",
    number: 2,
    label: "Solucao",
    summary: "Como a IA ajuda a resolver?",
    prompt:
      "Explique o que o seu produto faz, como a IA entra na solucao e qual o resultado para o usuario.",
    placeholder:
      "Ex.: Um assistente que responde duvidas frequentes a partir de um roteiro aprovado pelo dono...",
    icon: Lightbulb,
  },
  {
    key: "architecture",
    number: 3,
    label: "Arquitetura",
    summary: "Como funciona por dentro?",
    prompt:
      "Descreva os passos do fluxo, quais dados/ferramentas usa, onde a IA atua e o que um humano revisa.",
    placeholder:
      "Ex.: Entrada do usuario -> busca no roteiro -> IA redige resposta -> dono aprova antes de enviar...",
    icon: Layers,
  },
  {
    key: "prototype",
    number: 4,
    label: "Prototipo",
    summary: "O que voce ja construiu ou esbocou?",
    prompt:
      "Mostre o que existe hoje: um prompt reutilizavel, um esboco de tela, um link ou a descricao de um teste real.",
    placeholder:
      "Ex.: Criei o prompt-modelo e testei com 5 perguntas reais; cole aqui o prompt e um exemplo...",
    icon: Hammer,
  },
  {
    key: "validation",
    number: 5,
    label: "Validacao",
    summary: "Como voce sabe que funciona?",
    prompt:
      "Conte como testou com pessoas reais, o que deu certo, o que ajustaria e qual o proximo passo.",
    placeholder:
      "Ex.: Mostrei para 3 comerciantes; 2 usariam hoje, 1 pediu suporte a audio. Proximo passo: ...",
    icon: FlaskConical,
  },
];

/** Conta quantas etapas estao preenchidas (texto nao vazio). */
export function countFilledStages(project: BossProjectRow | null): number {
  if (!project) return 0;
  return BOSS_STAGES.filter(
    (stage) => (project[stage.key] ?? "").trim().length > 0,
  ).length;
}

/** True quando todas as etapas e o titulo estao preenchidos (pronto para enviar). */
export function isBossProjectComplete(project: BossProjectRow | null): boolean {
  if (!project) return false;
  const hasTitle = (project.title ?? "").trim().length > 0;
  return hasTitle && countFilledStages(project) === BOSS_STAGES.length;
}
