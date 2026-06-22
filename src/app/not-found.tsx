import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
        <Compass className="size-7" />
      </div>
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="max-w-md text-muted-foreground">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Button asChild>
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
