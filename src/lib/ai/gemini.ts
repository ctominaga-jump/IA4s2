import "server-only";

/**
 * Cliente mínimo da API do Google Gemini (Generative Language API).
 *
 * Usa `fetch` direto contra o endpoint REST `:generateContent` — sem SDK
 * adicional no package.json (mantém o bundle enxuto e evita risco extra no
 * build do Render). Lê `GEMINI_API_KEY` e, opcionalmente, `GEMINI_MODEL`
 * (default `gemini-2.5-flash`).
 *
 * Server-only: a chave NUNCA pode vazar para o client.
 */

const DEFAULT_MODEL = "gemini-2.5-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

/** Erro de domínio para falhas conhecidas da integração com o Gemini. */
export class GeminiError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

/** Subconjunto do JSON Schema aceito pelo `responseSchema` do Gemini. */
export interface GeminiSchema {
  type: "OBJECT" | "STRING" | "NUMBER" | "BOOLEAN" | "ARRAY";
  properties?: Record<string, GeminiSchema>;
  items?: GeminiSchema;
  enum?: string[];
  required?: string[];
  propertyOrdering?: string[];
}

export interface GenerateStructuredParams {
  /** Instrução de sistema (papel, regras, formato). */
  system: string;
  /** Conteúdo do usuário (dados concretos da tarefa). */
  user: string;
  /** Schema que força a saída em JSON estruturado. */
  schema: GeminiSchema;
  /** 0..1 — baixo deixa a avaliação mais consistente. Default 0.2. */
  temperature?: number;
  /** AbortSignal opcional para timeout. */
  signal?: AbortSignal;
}

/**
 * Chama o Gemini exigindo saída JSON conforme `schema` e devolve o objeto já
 * parseado e validado quanto a ser JSON. A validação de forma fica a cargo de
 * quem chama (ex.: Zod), pois o schema do Gemini é best-effort.
 */
export async function generateStructured<T = unknown>({
  system,
  user,
  schema,
  temperature = 0.2,
  signal,
}: GenerateStructuredParams): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError("GEMINI_API_KEY ausente no ambiente.");
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const url = `${API_BASE}/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          temperature,
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      }),
    });
  } catch (cause) {
    throw new GeminiError("Falha de rede ao contatar o Gemini.", cause);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new GeminiError(
      `Gemini respondeu ${response.status}: ${body.slice(0, 300)}`,
    );
  }

  const payload = (await response.json().catch(() => null)) as GeminiResponse | null;
  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new GeminiError("Gemini retornou resposta vazia.");
  }

  try {
    return JSON.parse(text) as T;
  } catch (cause) {
    throw new GeminiError("Gemini retornou JSON inválido.", cause);
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}
