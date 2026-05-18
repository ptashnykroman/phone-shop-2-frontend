"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/features/auth/hooks/use-auth";
import { useCartSessionStore } from "@/features/cart/stores/cart-session-store";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Вкажіть коректний email"),
  password: z.string().min(8, "Пароль має містити щонайменше 8 символів"),
});

const registerSchema = loginSchema.extend({
  firstName: z.string().min(2, "Вкажіть ім'я"),
  lastName: z.string().min(2, "Вкажіть прізвище"),
  phone: z.string().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type AuthFormValues = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const sessionId = useCartSessionStore((state) => state.sessionId);
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(
      mode === "login" ? loginSchema : registerSchema,
    ) as Resolver<AuthFormValues>,
    defaultValues:
      mode === "login"
        ? {
            email: "",
            password: "",
          }
        : {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phone: "",
          },
  });

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader className="space-y-2">
        <CardTitle>
          {mode === "login" ? "Вхід до акаунта" : "Створення акаунта"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {mode === "login"
            ? "Увійдіть, щоб оформлювати замовлення, зберігати обране й керувати кошиком."
            : "Зареєструйтесь, щоб зберігати замовлення, обране та отримати доступ до персональних сценаріїв."}
        </p>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            if (mode === "login") {
              loginMutation.mutate(
                { ...(values as LoginValues), sessionId: sessionId ?? undefined },
                {
                  onSuccess: () => router.push("/"),
                },
              );
              return;
            }

            registerMutation.mutate(values as RegisterValues, {
              onSuccess: () => router.push("/"),
            });
          })}
        >
          {mode === "register" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ім'я</Label>
                <Input id="firstName" {...form.register("firstName" as never)} />
                <p className="text-xs text-destructive">
                  {form.formState.errors.firstName?.message as string | undefined}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Прізвище</Label>
                <Input id="lastName" {...form.register("lastName" as never)} />
                <p className="text-xs text-destructive">
                  {form.formState.errors.lastName?.message as string | undefined}
                </p>
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            <p className="text-xs text-destructive">
              {form.formState.errors.email?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" {...form.register("password")} />
            <p className="text-xs text-destructive">
              {form.formState.errors.password?.message}
            </p>
          </div>

          {mode === "register" ? (
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" {...form.register("phone" as never)} />
              <p className="text-xs text-destructive">
                {form.formState.errors.phone?.message as string | undefined}
              </p>
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending || registerMutation.isPending}
          >
            {mode === "login" ? "Увійти" : "Зареєструватися"}
          </Button>

          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Ще немає акаунта?" : "Уже маєте акаунт?"}{" "}
            <Link
              href={mode === "login" ? "/auth/register" : "/auth/login"}
              className="font-semibold text-primary"
            >
              {mode === "login" ? "Зареєструватися" : "Увійти"}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
