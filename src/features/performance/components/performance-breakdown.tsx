"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import type { PerformanceScore } from "@/shared/api/api-types";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatPerformanceCategory } from "@/shared/utils/formatters";

const performanceFields: Array<keyof PerformanceScore> = [
  "everydayUseScore",
  "gamingScore",
  "cameraScore",
  "multitaskingScore",
  "batteryScore",
  "displayScore",
  "longTermUseScore",
];

export function PerformanceBreakdown({ score }: { score: PerformanceScore }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <CardTitle>Продуктивність у реальних задачах</CardTitle>
          <p className="text-sm text-muted-foreground">{score.explanation}</p>
        </div>
        <div className="h-40 w-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={[{ name: "загальна оцінка", value: score.overallScore, fill: "#0f766e" }]}
              innerRadius="68%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={12} />
              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-xl font-bold"
              >
                {score.overallScore}
              </text>
              <text
                x="50%"
                y="62%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs"
              >
                оцінка
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {performanceFields.map((field) => (
          <div key={field} className="space-y-2 rounded-2xl border border-border/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{formatPerformanceCategory(field)}</p>
              <Badge variant="outline">{score[field]}/100</Badge>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${score[field]}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
