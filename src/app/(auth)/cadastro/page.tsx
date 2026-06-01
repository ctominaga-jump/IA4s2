import { redirect } from "next/navigation";

import { getSessionUser, dashboardPathForRole } from "@/lib/auth/session";
import { SignUpForm } from "./signup-form";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const session = await getSessionUser();
  if (session) redirect(dashboardPathForRole(session.appUser.role));

  return <SignUpForm />;
}
