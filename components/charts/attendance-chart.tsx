"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  { month: "Jan", hadir: 186, izin: 80, alpha: 12 },
  { month: "Feb", hadir: 305, izin: 200, alpha: 8 },
  { month: "Mar", hadir: 237, izin: 120, alpha: 15 },
  { month: "Apr", hadir: 73, izin: 190, alpha: 5 },
  { month: "Mei", hadir: 209, izin: 130, alpha: 10 },
  { month: "Jun", hadir: 214, izin: 140, alpha: 7 },
];

const chartConfig = {
  hadir: {
    label: "Hadir",
    color: "hsl(var(--chart-1))",
  },
  izin: {
    label: "Izin",
    color: "hsl(var(--chart-2))",
  },
  alpha: {
    label: "Alpha",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Absensi</CardTitle>
        <CardDescription>Januari - Juni 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="hadir" fill="var(--color-hadir)" radius={4} />
            <Bar dataKey="izin" fill="var(--color-izin)" radius={4} />
            <Bar dataKey="alpha" fill="var(--color-alpha)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up 5.2% bulan ini <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Menampilkan data absensi 6 bulan terakhir
        </div>
      </CardFooter>
    </Card>
  );
}
