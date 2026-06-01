"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Users,
} from "lucide-react";

import { signUpAction, type AuthFormState } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type Role = "student" | "teacher";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      Criar conta
    </Button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState<AuthFormState, FormData>(
    signUpAction,
    {},
  );
  const [role, setRole] = useState<Role>("student");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Criar sua conta</CardTitle>
        <CardDescription>
          Comece a aprender fazendo, com missoes reais e feedback humano.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
          {state.message ? (
            <Alert variant="success">
              <CheckCircle2 />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label>Eu sou</Label>
            <div className="grid grid-cols-2 gap-3">
              <RoleOption
                value="student"
                active={role === "student"}
                onSelect={setRole}
                icon={<GraduationCap className="size-5" />}
                label="Aluno"
              />
              <RoleOption
                value="teacher"
                active={role === "teacher"}
                onSelect={setRole}
                icon={<Users className="size-5" />}
                label="Professor"
              />
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Seu nome"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Minimo de 6 caracteres"
              minLength={6}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <SubmitButton />
          <p className="text-center text-sm text-muted-foreground">
            Ja tem conta?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

function RoleOption({
  value,
  active,
  onSelect,
  icon,
  label,
}: {
  value: Role;
  active: boolean;
  onSelect: (role: Role) => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg border p-3 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-accent text-accent-foreground"
          : "border-input hover:bg-muted",
      )}
      aria-pressed={active}
    >
      {icon}
      {label}
    </button>
  );
}
