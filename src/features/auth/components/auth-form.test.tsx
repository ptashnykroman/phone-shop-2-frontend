import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthForm } from "@/features/auth/components/auth-form";
import { renderWithClient } from "@/shared/test/test-utils";

const push = vi.fn();
const loginMutate = vi.fn();
const registerMutate = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useLoginMutation: () => ({
    mutate: loginMutate,
    isPending: false,
  }),
  useRegisterMutation: () => ({
    mutate: registerMutate,
    isPending: false,
  }),
}));

vi.mock("@/features/cart/stores/cart-session-store", () => ({
  useCartSessionStore: (selector: (state: { sessionId: string }) => string) =>
    selector({ sessionId: "guest-session-1" }),
}));

describe("AuthForm", () => {
  it("submits login data with guest session id", async () => {
    renderWithClient(<AuthForm mode="login" />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@test.dev" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "Password123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Увійти" }));

    await waitFor(() =>
      expect(loginMutate).toHaveBeenCalledWith(
        {
          email: "user@test.dev",
          password: "Password123!",
          sessionId: "guest-session-1",
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      ),
    );
  });

  it("normalizes phone before submitting register data", async () => {
    renderWithClient(<AuthForm mode="register" />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@test.dev" },
    });
    fireEvent.change(document.getElementById("password")!, {
      target: { value: "Password123!" },
    });
    fireEvent.change(document.getElementById("firstName")!, {
      target: { value: "Ivan" },
    });
    fireEvent.change(document.getElementById("lastName")!, {
      target: { value: "Petrenko" },
    });
    fireEvent.change(document.getElementById("phone")!, {
      target: { value: "+38 (067) 123-45-67" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(registerMutate).toHaveBeenCalledWith(
        {
          email: "user@test.dev",
          password: "Password123!",
          firstName: "Ivan",
          lastName: "Petrenko",
          phone: "+380671234567",
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      ),
    );
  });
});
