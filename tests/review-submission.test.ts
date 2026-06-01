import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
  rpc: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("@/lib/auth/session", () => ({
  requireTeacherContext: vi.fn(async () => ({
    teacherProfile: { id: "00000000-0000-0000-0000-0000000000aa" },
  })),
}));

vi.mock("@/lib/supabase/service", () => ({
  createSupabaseServiceClient: vi.fn(() => ({
    rpc: mocks.rpc,
  })),
}));

import { reviewSubmissionAction } from "@/server/reviews";

describe("review submission action", () => {
  beforeEach(() => {
    mocks.redirect.mockClear();
    mocks.rpc.mockReset();
  });

  it("requires a valid decision and feedback before calling the RPC", async () => {
    const result = await reviewSubmissionAction(
      {},
      formData({
        submissionId: "00000000-0000-0000-0000-000000000001",
        decision: "approved",
        comment: "   ",
      }),
    );

    expect(result.error).toBe("O feedback e obrigatorio para aprovar ou reprovar.");
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("calls review_submission with teacher profile, decision and trimmed comment", async () => {
    mocks.rpc.mockResolvedValue({ error: null });

    await expect(() =>
      reviewSubmissionAction(
        {},
        formData({
          submissionId: "00000000-0000-0000-0000-000000000001",
          decision: "approved",
          comment: "  Bom trabalho  ",
        }),
      ),
    ).rejects.toThrow("NEXT_REDIRECT:/professor/fila?avaliada=1");

    expect(mocks.rpc).toHaveBeenCalledWith("review_submission", {
      p_submission_id: "00000000-0000-0000-0000-000000000001",
      p_teacher_profile_id: "00000000-0000-0000-0000-0000000000aa",
      p_decision: "approved",
      p_comment: "Bom trabalho",
    });
  });

  it("maps known RPC errors to user-facing messages", async () => {
    mocks.rpc.mockResolvedValue({
      error: { message: "submission_not_pending" },
    });

    const result = await reviewSubmissionAction(
      {},
      formData({
        submissionId: "00000000-0000-0000-0000-000000000001",
        decision: "rejected",
        comment: "Precisa revisar.",
      }),
    );

    expect(result.error).toBe("Esta entrega ja foi avaliada e nao pode ser alterada.");
  });
});

function formData(values: {
  submissionId: string;
  decision: string;
  comment: string;
}): FormData {
  const data = new FormData();
  data.set("submissionId", values.submissionId);
  data.set("decision", values.decision);
  data.set("comment", values.comment);
  return data;
}
