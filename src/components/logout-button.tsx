"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

function LogoutInner() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      disabled={pending}
      className="text-muted-foreground"
    >
      <LogOut className="size-4" />
      Sair
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <LogoutInner />
    </form>
  );
}
