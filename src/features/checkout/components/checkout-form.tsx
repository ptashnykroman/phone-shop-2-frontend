"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateOrderMutation } from "@/features/orders/hooks/use-orders";
import type { Cart } from "@/shared/api/api-types";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { formatPrice } from "@/shared/utils/formatters";

const checkoutSchema = z.object({
  deliveryType: z.enum(["COURIER", "PICKUP"], {
    message: "Оберіть тип доставки",
  }),
  deliveryAddress: z
    .string()
    .min(5, "Вкажіть адресу або точку самовивозу"),
  paymentMethod: z.enum(["MOCK", "CARD", "CASH_ON_DELIVERY"], {
    message: "Оберіть спосіб оплати",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm({ cart }: { cart: Cart }) {
  const router = useRouter();
  const createOrderMutation = useCreateOrderMutation();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: "COURIER",
      deliveryAddress: "",
      paymentMethod: "MOCK",
    },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle>Дані доставки</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) =>
              createOrderMutation.mutate(values, {
                onSuccess: (order) => {
                  if (values.paymentMethod === "MOCK") {
                    router.push(`/payment/mock?orderId=${order.id}`);
                    return;
                  }

                  router.push(`/orders/${order.id}`);
                },
              }),
            )}
          >
            <div className="space-y-2">
              <Label htmlFor="deliveryType">Тип доставки</Label>
              <Select
                id="deliveryType"
                value={form.watch("deliveryType")}
                onChange={(event) =>
                  form.setValue("deliveryType", event.target.value as "COURIER" | "PICKUP")
                }
                options={[
                  { label: "Кур'єр", value: "COURIER" },
                  { label: "Самовивіз", value: "PICKUP" },
                ]}
              />
              <p className="text-xs text-destructive">
                {form.formState.errors.deliveryType?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Адреса / пункт видачі</Label>
              <Input id="deliveryAddress" {...form.register("deliveryAddress")} />
              <p className="text-xs text-destructive">
                {form.formState.errors.deliveryAddress?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Спосіб оплати</Label>
              <Select
                id="paymentMethod"
                value={form.watch("paymentMethod")}
                onChange={(event) =>
                  form.setValue(
                    "paymentMethod",
                    event.target.value as "MOCK" | "CARD" | "CASH_ON_DELIVERY",
                  )
                }
                options={[
                  { label: "Mock payment (демо)", value: "MOCK" },
                  { label: "Картка", value: "CARD" },
                  { label: "Оплата при отриманні", value: "CASH_ON_DELIVERY" },
                ]}
              />
              <p className="text-xs text-muted-foreground">
                Backend має окремий mock-flow лише для `MOCK`, тому саме цей сценарій веде на демонстрацію оплати.
              </p>
            </div>

            <Button type="submit" disabled={createOrderMutation.isPending}>
              Створити замовлення
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Підсумок замовлення</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-muted-foreground">Кількість: {item.quantity}</p>
              </div>
              <p className="font-semibold">{item.lineTotal} грн</p>
            </div>
          ))}
          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Всього до сплати</p>
            <p className="mt-2 text-3xl font-bold">{formatPrice(cart.subtotal)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
