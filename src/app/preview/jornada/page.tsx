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
 * Reflete a jornada completa de 8 fases (Despertar -> Boss Final, 24 missoes).
 */

const VM: JourneyBoardViewModel = {
  courseTitle: "Jornada IA para Vida Real",
  courseDescription:
    "Do primeiro contato com IA ate desenhar suas proprias solucoes. Voce avanca por fases praticas, envia entregas reais e evolui com feedback de um mentor.",
  goalTitle: "Usar IA para acelerar meus estudos de programacao",
  overallApproved: 6,
  overallTotal: 24,
  overallPercent: 25,
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
      name: "Operador de IA",
      tagline:
        "Coloque a IA nos seus fluxos reais de trabalho: voce decide, revisa e reutiliza.",
      state: "locked",
      total: 4,
      approved: 0,
      percent: 0,
      isBoss: false,
      missions: [
        {
          id: "m501",
          title: "Mapeie um fluxo real seu",
          description: "Enxergue o trabalho repetitivo e onde a IA agrega.",
          status: "not_started",
          xpReward: 90,
          difficulty: "medium",
          estimatedMinutes: 40,
        },
        {
          id: "m502",
          title: "Crie um prompt operacional reutilizavel",
          description: "Um prompt-modelo com variaveis e checklist de revisao.",
          status: "not_started",
          xpReward: 100,
          difficulty: "medium",
          estimatedMinutes: 45,
        },
        {
          id: "m504",
          title: "Execute o fluxo em uma ferramenta de trabalho",
          description: "Rode o fluxo em 2 casos reais e revise cada saida.",
          status: "not_started",
          xpReward: 130,
          difficulty: "hard",
          estimatedMinutes: 55,
        },
        {
          id: "m503",
          title: "Documente o procedimento para outra pessoa",
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
      name: "Operador Tecnico",
      tagline:
        "Pilote a IA em ambiente tecnico guiado, sem precisar virar programador.",
      state: "locked",
      total: 4,
      approved: 0,
      percent: 0,
      isBoss: false,
      missions: [
        {
          id: "m1601",
          title: "Entenda o ambiente",
          description: "Glossario aplicado: terminal, pasta, arquivo, comando, erro, log.",
          status: "not_started",
          xpReward: 55,
          difficulty: "easy",
          estimatedMinutes: 25,
        },
        {
          id: "m1602",
          title: "Leia um erro com a IA",
          description: "Separe mensagem, causa provavel e proximo passo.",
          status: "not_started",
          xpReward: 80,
          difficulty: "medium",
          estimatedMinutes: 35,
        },
        {
          id: "m1603",
          title: "Alteracao minima guiada em um arquivo",
          description: "Uma mudanca pequena e reversivel, com antes/depois.",
          status: "not_started",
          xpReward: 90,
          difficulty: "medium",
          estimatedMinutes: 40,
        },
        {
          id: "m1604",
          title: "Navegue um projeto e proponha uma mini-melhoria",
          description: "Leitura orientada com IA e uma melhoria pequena testavel.",
          status: "not_started",
          xpReward: 100,
          difficulty: "medium",
          estimatedMinutes: 45,
        },
      ],
    },
    {
      number: 7,
      name: "Arquiteto de Agentes",
      tagline:
        "Desenhe agentes como sistemas: objetivo, ferramentas, limites e validacao.",
      state: "locked",
      total: 4,
      approved: 0,
      percent: 0,
      isBoss: false,
      missions: [
        {
          id: "m601",
          title: "Desenhe um agente simples",
          description: "Objetivo, ferramentas, passos, limites, sucesso e fallback.",
          status: "not_started",
          xpReward: 140,
          difficulty: "hard",
          estimatedMinutes: 60,
        },
        {
          id: "m604",
          title: "Transforme uma tarefa em cadeia de etapas",
          description: "Etapas encadeadas com o que entra e sai entre elas.",
          status: "not_started",
          xpReward: 100,
          difficulty: "medium",
          estimatedMinutes: 45,
        },
        {
          id: "m602",
          title: "Defina papeis de agentes",
          description: "Responsabilidades, transferencia, conflito e decisao final.",
          status: "not_started",
          xpReward: 130,
          difficulty: "hard",
          estimatedMinutes: 55,
        },
        {
          id: "m603",
          title: "Plano do seu produto com IA",
          description: "Plano de uma pagina com a sua propria rubrica de sucesso.",
          status: "not_started",
          xpReward: 150,
          difficulty: "hard",
          estimatedMinutes: 60,
        },
      ],
    },
    {
      number: 8,
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
