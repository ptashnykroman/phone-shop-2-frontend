"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthSession } from "@/features/auth/hooks/use-auth";
import { useCreateReviewMutation } from "@/features/reviews/hooks/use-reviews";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

const reviewSchema = z.object({
  rating: z.coerce
    .number({ invalid_type_error: "Оберіть оцінку" })
    .min(1, "Мінімальна оцінка 1")
    .max(5, "Максимальна оцінка 5"),
  text: z.string().min(10, "Відгук має містити щонайменше 10 символів"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const { user } = useAuthSession();
  const reviewMutation = useCreateReviewMutation(productId);
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      text: "",
    },
  });

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Залишити відгук</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Щоб залишити відгук, спочатку увійдіть в акаунт.
          </p>
          <Button onClick={() => router.push("/auth/login")}>Увійти</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Залишити відгук</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) =>
            reviewMutation.mutate(values),
          )}
        >
          <div className="space-y-2">
            <Label htmlFor="rating">Оцінка</Label>
            <Input
              id="rating"
              type="number"
              min={1}
              max={5}
              {...form.register("rating")}
            />
            <p className="text-xs text-destructive">
              {form.formState.errors.rating?.message}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="text">Текст відгуку</Label>
            <Textarea id="text" {...form.register("text")} />
            <p className="text-xs text-destructive">
              {form.formState.errors.text?.message}
            </p>
            <p className="text-xs text-muted-foreground">
              Після надсилання відгук очікуватиме модерацію.
            </p>
          </div>
          <Button type="submit" disabled={reviewMutation.isPending}>
            Надіслати відгук
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
