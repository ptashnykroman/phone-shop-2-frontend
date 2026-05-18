import type { ProductPublicReview } from "@/shared/api/api-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatDate } from "@/shared/utils/formatters";

export function ReviewList({ reviews }: { reviews: ProductPublicReview[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Відгуки покупців</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-border/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">
                {review.user.firstName} {review.user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(review.createdAt)}
              </p>
            </div>
            <p className="mt-1 text-sm font-medium">Оцінка: {review.rating}/5</p>
            <p className="mt-3 text-sm text-muted-foreground">{review.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
