import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Cliente Supabase ligado a sessao do usuario autenticado (cookies).
 * Usado para identificar o usuario logado (auth.getUser) e operacoes
 * de autenticacao. Como o app renderiza tudo no servidor, as leituras
 * de dados de dominio passam pelo cliente de service role apos a
 * validacao de perfil — ver lib/supabase/service.ts.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado a partir de um Server Component sem resposta mutavel.
            // A renovacao de sessao acontece no middleware, entao podemos ignorar.
          }
        },
      },
    },
  );
}
