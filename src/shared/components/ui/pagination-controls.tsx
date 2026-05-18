import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function PaginationControls({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="outline" asChild disabled={page <= 1}>
        <Link href={page <= 1 ? "#" : buildHref(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
          Попередня
        </Link>
      </Button>
      <p className="text-sm text-muted-foreground">
        Сторінка {page} з {totalPages}
      </p>
      <Button variant="outline" asChild disabled={page >= totalPages}>
        <Link href={page >= totalPages ? "#" : buildHref(page + 1)}>
          Наступна
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
