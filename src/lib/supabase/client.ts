import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso no browser (client components).
 * Usa a chave publica (anon). Operacoes sensiveis NUNCA dependem
 * apenas deste cliente — a autorização real acontece no servidor.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
