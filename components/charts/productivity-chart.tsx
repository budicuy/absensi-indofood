"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { week: "Week 1", target: 90, actual: 88 },
  { week: "Week 2", target: 90, actual: 92 },
  { week: "Week 3", target: 90, actual: 87 },
  { week: "Week 4", target: 90, actual: 94 },
  { week: "Week 5", target: 90, actual: 91 },
  { week: "Week 6", target: 90, actual: 95 },
];

const chartConfig = {
  target: {
    label: "Target",
    color: "hsl(var(--chart-2))",
  },
  actual: {
    label: "Aktual",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProductivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Produktivitas</CardTitle>
        <CardDescription>
          Perbandingan target vs aktual produktivitas (%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 2)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[80, 100]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="target"
              type="monotone"
              stroke="var(--color-target)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              dataKey="actual"
              type="monotone"
              stroke="var(--color-actual)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-actual)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
