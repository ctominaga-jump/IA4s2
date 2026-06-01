import { redirect } from "next/navigation";

import { getSessionUser, dashboardPathForRole } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const session = await getSessionUser();
  if (session) redirect(dashboardPathForRole(session.appUser.role));

  const { redirectTo } = await searchParams;
  return <LoginForm redirectTo={redirectTo} />;
}
