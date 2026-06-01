import { notFound } from "next/navigation";

import { StudentGameShell } from "@/components/game/student-game-shell";
import {
  JourneyBoard,
  type JourneyBoardViewModel,
} from "@/components/game/journey-board";

export const dynamic = "force-dynamic";

/**
 * Preview SEM autenticacao do mapa da jornada, usado apenas para validacao
 * visual por screenshot. Dados ficticios; nao toca Supabase/XP/auth.
 * Reflete a jornada completa da Fase 5 (Despertar -> Arquiteto, 18 missoes).
 */

const VM: JourneyBoardViewModel = {
  courseTitle: "Jornada IA para Vida Real",
  courseDescription:
    "Do primeiro contato com IA ate desenhar suas proprias solucoes. Voce avanca por fases praticas, envia entregas reais e evolui com feedback de um mentor.",
  goalTitle: "Usar IA para acelerar meus estudos de programacao",
  overallApproved: 6,
  overallTotal: 18,
  overallPercent: 33,
  phases: [
    {
      number: 1,
      name: "Despertar",
      tagline: "Descubra o que e IA e como ela ja aparece no seu dia a dia.",
      state: "complete",
      total: 3,
      approved: 3,
      percent: 100,
      isBoss: false,
      missions: [
        {
          id: "m101",
          title: "Descubra a IA no seu dia",
          description:
            "Perceba onde a IA ja aparece na sua rotina antes de comecar a usar.",
          status: "approved",
          xpReward: 40,
          difficulty: "easy",
          estimatedMinutes: 10,
        },
        {
          id: "m102",
          title: "Sua primeira conversa com IA",
          description: "Tenha uma conversa de verdade com uma ferramenta de IA.",
          status: "approved",
          xpReward: 40,
          difficulty: "easy",
          estimatedMinutes: 15,
        },
        {
          id: "m001",
          title: "Crie um prompt claro",
          description:
            "Use IA para apoiar uma tarefa real com contexto, objetivo e formato.",
          status: "approved",
          xpReward: 50,
          difficulty: "easy",
          estimatedMinutes: 15,
        },
      ],
    },
    {
      number: 2,
      name: "Explorador",
      tagline: "Converse com a IA, pesquise e comece a validar respostas.",
      state: "active",
      total: 3,
      approved: 3,
      percent: 100,
      isBoss: false,
      missions: [
        {
          id: "m002",
          title: "Resolva uma tarefa real com IA",
          description:
            "Pegue uma necessidade concreta e chegue a um resultado util.",
          status: "approved",
          xpReward: 60,
          difficulty: "easy",
          estimatedMinutes: 20,
        },
        {
          id: "m003",
          title: "Revise e melhore um texto com IA",
          description: "Use IA para revisar um texto seu sem perder a sua voz.",
          status: "pending",
          xpReward: 70,
          difficulty: "medium",
          estimatedMinutes: 20,
        },
        {
          id: "m203",
          title: "Cheque uma resposta da IA",
          description: "Aprenda a desconfiar e verificar antes de usar.",
          status: "not_started",
          xpReward: 70,
          difficulty: "medium",
          estimatedMinutes: 20,
        },
      ],
    },
    {
      number: 3,
      name: "Estrategista",
      tagline:
        "Domine contexto, objetivo, formato e criterios nos seus prompts.",
      state: "locked",
      total: 3,
      approved: 0,
      percent: 0,
      isBoss: false,
      missions: [
        {
          id: "m004",
          title: "Planeje um objetivo em passos",
          description: "Quebre seu objetivo real em um plano pratico com IA.",
          status: "not_started",
          xpReward: 80,
          difficulty: "medium",
          estimatedMinutes: 25,
        },
        {
          id: "m302",
          title: "Prompt com criterios de qualidade",
          description: "Diga a IA o que torna uma boa resposta.",
          status: "not_started",
          xpReward: 85,
          difficulty: "medium",
          estimatedMinutes: 25,
        },
        {
          id: "m303",
          title: "Itere ate o resultado certo",
          description: "Refine a resposta em rodadas com pedidos especificos.",
          status: "not_started",
          xpReward: 90,
          difficulty: "medium",
          estimatedMinutes: 30,
        },
      ],
    },
    {
      number: 4,
      name: "Criador",
      tagline: "Organize ideias e crie pequenos projetos com apoio de IA.",
      state: "locked",
      total: 3,
      approved: 0,
      percent: 0,
      isBoss: false,
      missions: [
        {
          id: "m005",
          title: "Use IA para aprender algo novo",
          description: "Use IA como tutor e mostre que entendeu de verdade.",
          status: "not_started",
          xpReward: 100,
          difficulty: "medium",
          estimatedMinutes: 30,
        },
        {
          id: "m402",
          title: "Crie um material com IA",
          description: "Produza um post, roteiro ou resumo de ponta a ponta.",
          status: "not_started",
          xpReward: 100,
          difficulty: "medium",
          estimatedMinutes: 40,
        },
        {
          id: "m403",
          title: "Monte um mini-projeto guiado",
          description: "Una o que aprendeu em um projeto com inicio, meio e fim.",
          status: "not_started",
          xpReward: 120,
          difficulty: "hard",
          estimatedMinutes: 45,
        },
      ],
    },
    {
      number: 5,
      name: "Operador",
      tagline: "Use IA em fluxos: planeje, automatize passos e documente.",
      state: "locked",
      total: 3,
      approved: 0,
      percent: 0,
      isBoss: false,
      missions: [
        {
          id: "m501",
          title: "Mapeie uma tarefa repetitiva",
          description: "Enxergue o trabalho repetitivo passivel de apoio por IA.",
          status: "not_started",
          xpReward: 100,
          difficulty: "medium",
          estimatedMinutes: 40,
        },
        {
          id: "m502",
          title: "Crie um fluxo assistido por IA",
          description: "Transforme a tarefa em um fluxo com prompt reutilizavel.",
          status: "not_started",
          xpReward: 130,
          difficulty: "hard",
          estimatedMinutes: 50,
        },
        {
          id: "m503",
          title: "Documente seu fluxo para reuso",
          description: "Deixe o fluxo pronto para outra pessoa usar.",
          status: "not_started",
          xpReward: 100,
          difficulty: "medium",
          estimatedMinutes: 40,
        },
      ],
    },
    {
      number: 6,
      name: "Arquiteto de IA",
      tagline: "Desenhe agentes, arquitetura e produto de ponta a ponta.",
      state: "locked",
      total: 3,
      approved: 0,
      percent: 0,
      isBoss: false,
      missions: [
        {
          id: "m601",
          title: "Desenhe um agente de IA",
          description: "Pense em um assistente com objetivo, ferramentas e passos.",
          status: "not_started",
          xpReward: 140,
          difficulty: "hard",
          estimatedMinutes: 60,
        },
        {
          id: "m602",
          title: "Especifique uma solucao com IA",
          description: "Transforme uma ideia em uma especificacao clara.",
          status: "not_started",
          xpReward: 140,
          difficulty: "hard",
          estimatedMinutes: 60,
        },
        {
          id: "m603",
          title: "Plano do seu produto com IA",
          description: "Consolide a jornada em um plano de produto com IA.",
          status: "not_started",
          xpReward: 150,
          difficulty: "hard",
          estimatedMinutes: 60,
        },
      ],
    },
    {
      number: 7,
      name: "Boss Final",
      tagline: "Integre tudo em um produto com IA: do problema a validacao.",
      state: "empty",
      total: 0,
      approved: 0,
      percent: 0,
      isBoss: true,
      missions: [],
    },
  ],
};

export default function JourneyPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <StudentGameShell
      userName="Marina Souza"
      totalXp={320}
      levelLabel="Nv 3 · Praticante de IA"
    >
      <JourneyBoard {...VM} />
    </StudentGameShell>
  );
}
