import { Info } from "lucide-react";
import type { ExplainedSpecificationGroup } from "@/shared/api/api-types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function ExplainedSpecifications({
  groups,
}: {
  groups: ExplainedSpecificationGroup[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Характеристики простими словами</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-4">
          {groups.map((group) => (
            <AccordionItem
              key={group.groupName}
              value={group.groupName}
              className="rounded-2xl border border-border px-4"
            >
              <AccordionTrigger className="text-base">
                {group.groupName}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-border/70 bg-muted/30 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{item.label}</p>
                      <Badge variant={item.importance >= 8 ? "default" : "outline"}>
                        Важливість {item.importance}/10
                      </Badge>
                    </div>
                    <p className="mt-2 text-lg font-bold">
                      {item.value}
                      {item.unit ? ` ${item.unit}` : ""}
                    </p>
                    {item.simpleExplanation ? (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {item.simpleExplanation}
                      </p>
                    ) : null}
                    {item.practicalImpact ? (
                      <div className="mt-3 flex gap-2 rounded-2xl bg-background p-3 text-sm text-muted-foreground">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p>{item.practicalImpact}</p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
