"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { department: "Production", value: 425, fill: "hsl(var(--chart-1))" },
  { department: "QC", value: 180, fill: "hsl(var(--chart-2))" },
  { department: "IT", value: 95, fill: "hsl(var(--chart-3))" },
  { department: "HR", value: 142, fill: "hsl(var(--chart-4))" },
  { department: "Finance", value: 87, fill: "hsl(var(--chart-5))" },
  { department: "Lainnya", value: 305, fill: "hsl(var(--chart-6))" },
];

const chartConfig = {
  value: {
    label: "Karyawan",
  },
  production: {
    label: "Production",
    color: "hsl(var(--chart-1))",
  },
  qc: {
    label: "QC",
    color: "hsl(var(--chart-2))",
  },
  it: {
    label: "IT",
    color: "hsl(var(--chart-3))",
  },
  hr: {
    label: "HR",
    color: "hsl(var(--chart-4))",
  },
  finance: {
    label: "Finance",
    color: "hsl(var(--chart-5))",
  },
  lainnya: {
    label: "Lainnya",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

export function DepartmentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Karyawan per Departemen</CardTitle>
        <CardDescription>
          Proporsi karyawan di setiap departemen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="department"
              cx="50%"
              cy="50%"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.department}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
