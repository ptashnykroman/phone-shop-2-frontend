"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/shared/components/ui/input";

export function HeaderSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      className="relative hidden w-full max-w-md lg:block"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/products?search=${encodeURIComponent(value.trim())}`);
      }}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Пошук за назвою, брендом або характеристикою"
        className="pl-11"
      />
    </form>
  );
}
