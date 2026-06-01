import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import { requireStudentContext } from "@/lib/auth/session";
import { OnboardingForm } from "./onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { appUser, studentProfile } = await requireStudentContext();

  if (studentProfile.onboarding_completed_at) {
    redirect("/aluno");
  }

  const firstName = appUser.name.split(" ")[0] ?? appUser.name;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-accent/60 to-background">
      <header className="container flex h-16 items-center">
        <div className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          IA para Vida Real
        </div>
      </header>
      <main className="container flex flex-1 items-start justify-center py-10">
        <div className="w-full max-w-xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Boas-vindas, {firstName}!</h1>
            <p className="mt-2 text-muted-foreground">
              Aqui voce aprende fazendo: conclui missoes praticas, envia
              entregas, recebe feedback de um professor e evolui com XP e
              niveis. Voce nao precisa saber de IA para comecar.
            </p>
          </div>
          <OnboardingForm />
        </div>
      </main>
    </div>
  );
}
