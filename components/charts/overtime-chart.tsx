"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  { month: "Jan", overtime: 186 },
  { month: "Feb", overtime: 305 },
  { month: "Mar", overtime: 237 },
  { month: "Apr", overtime: 273 },
  { month: "Mei", overtime: 209 },
  { month: "Jun", overtime: 314 },
];

const chartConfig = {
  overtime: {
    label: "Overtime",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function OvertimeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Overtime</CardTitle>
        <CardDescription>
          Total jam overtime per bulan dalam tahun ini
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="overtime"
              type="natural"
              fill="var(--color-overtime)"
              fillOpacity={0.4}
              stroke="var(--color-overtime)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
