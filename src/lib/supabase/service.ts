import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";

/**
 * Cliente Supabase com a chave de service role. Ignora RLS.
 *
 * REGRA DE SEGURANCA: so pode ser usado em codigo de servidor (server
 * actions, server components, route handlers) DEPOIS de validar o perfil
 * e a propriedade do recurso. Toda a autorizacao por perfil vive na camada
 * de servidor (lib/auth/*). Este cliente nunca deve ser importado em codigo
 * que rode no browser.
 */
export function createSupabaseServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
