import { notFound } from "next/navigation";

import { StudentGameShell } from "@/components/game/student-game-shell";
import {
  BossFinalHub,
  type BossFinalViewModel,
} from "@/components/game/boss-final-hub";

export const dynamic = "force-dynamic";

/**
 * Preview SEM autenticacao do Boss Final, usado apenas para validacao visual
 * por screenshot. Dados ficticios; nao toca Supabase/XP/auth.
 */

const VM: BossFinalViewModel = {
  status: "draft",
  title: "Atende Facil — assistente de respostas para pequenos negocios",
  stages: {
    problem:
      "Pequenos comerciantes perdem horas respondendo as mesmas duvidas no WhatsApp (horario, preco, entrega), e demoram a responder novos clientes.",
    solution:
      "Um assistente que responde as duvidas frequentes a partir de um roteiro aprovado pelo dono, sempre deixando a decisao final com ele.",
    architecture:
      "Cliente pergunta -> o assistente busca no roteiro -> a IA redige uma resposta no tom do negocio -> o dono aprova antes de enviar.",
    prototype: "",
    validation: "",
  },
  feedback: null,
  reviewedAt: null,
  submittedAt: null,
  filledCount: 3,
  isComplete: false,
  journeyApproved: 16,
  journeyTotal: 18,
  journeyComplete: false,
  justSubmitted: false,
};

export default function BossFinalPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <StudentGameShell
      userName="Marina Souza"
      totalXp={905}
      levelLabel="Nv 5 · Autonomia com IA"
    >
      <BossFinalHub {...VM} />
    </StudentGameShell>
  );
}
