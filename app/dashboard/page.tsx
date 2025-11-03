"use client";

import {
  Building2,
  Clock,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Data untuk charts
const absensiData = [
  { month: "Jan", hadir: 186, izin: 80, sakit: 20, alpha: 10 },
  { month: "Feb", hadir: 305, izin: 200, sakit: 30, alpha: 15 },
  { month: "Mar", hadir: 237, izin: 120, sakit: 25, alpha: 12 },
  { month: "Apr", hadir: 273, izin: 190, sakit: 35, alpha: 18 },
  { month: "Mei", hadir: 209, izin: 130, sakit: 28, alpha: 14 },
  { month: "Jun", hadir: 214, izin: 140, sakit: 32, alpha: 16 },
];

const overtimeData = [
  { month: "Jan", hours: 120 },
  { month: "Feb", hours: 150 },
  { month: "Mar", hours: 180 },
  { month: "Apr", hours: 140 },
  { month: "Mei", hours: 200 },
  { month: "Jun", hours: 170 },
];

const departmentData = [
  { name: "Produksi", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "Marketing", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "IT", value: 200, fill: "hsl(var(--chart-3))" },
  { name: "HR", value: 150, fill: "hsl(var(--chart-4))" },
  { name: "Finance", value: 100, fill: "hsl(var(--chart-5))" },
];

const performanceData = [
  { month: "Jan", target: 400, actual: 380 },
  { month: "Feb", target: 400, actual: 420 },
  { month: "Mar", target: 400, actual: 390 },
  { month: "Apr", target: 400, actual: 410 },
  { month: "Mei", target: 400, actual: 430 },
  { month: "Jun", target: 400, actual: 415 },
];

const absensiConfig = {
  hadir: {
    label: "Hadir",
    color: "hsl(var(--chart-1))",
  },
  izin: {
    label: "Izin",
    color: "hsl(var(--chart-2))",
  },
  sakit: {
    label: "Sakit",
    color: "hsl(var(--chart-3))",
  },
  alpha: {
    label: "Alpha",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const overtimeConfig = {
  hours: {
    label: "Hours",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const performanceConfig = {
  target: {
    label: "Target",
    color: "hsl(var(--chart-1))",
  },
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Selamat datang di Sistem Absensi Indofood
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Online
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Karyawan
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +20.1% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Hadir Hari Ini
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,180</div>
              <p className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                95.6% kehadiran
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Overtime
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">170 Jam</div>
              <p className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                -15% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Departemen
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Aktif beroperasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Statistik Absensi Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={absensiConfig} className="h-[300px]">
                <BarChart accessibilityLayer data={absensiData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="hadir"
                    fill="var(--color-hadir)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="izin"
                    fill="var(--color-izin)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="sakit"
                    fill="var(--color-sakit)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="alpha"
                    fill="var(--color-alpha)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Trend Overtime</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={overtimeConfig} className="h-[300px]">
                <AreaChart accessibilityLayer data={overtimeData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="hours"
                    type="monotone"
                    fill="var(--color-hours)"
                    fillOpacity={0.4}
                    stroke="var(--color-hours)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Distribusi Karyawan per Departemen</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer
                config={{
                  value: {
                    label: "Karyawan",
                  },
                }}
                className="h-[300px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={departmentData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Target vs Actual Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={performanceConfig} className="h-[300px]">
                <LineChart accessibilityLayer data={performanceData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    dataKey="target"
                    type="monotone"
                    stroke="var(--color-target)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="actual"
                    type="monotone"
                    stroke="var(--color-actual)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-actual)",
                    }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "John Doe",
                  action: "Clock in",
                  time: "08:00 AM",
                  type: "success",
                },
                {
                  name: "Jane Smith",
                  action: "Clock out",
                  time: "05:30 PM",
                  type: "info",
                },
                {
                  name: "Bob Johnson",
                  action: "Overtime request",
                  time: "03:15 PM",
                  type: "warning",
                },
                {
                  name: "Alice Williams",
                  action: "Sick leave",
                  time: "07:45 AM",
                  type: "error",
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "info"
                            ? "bg-blue-500"
                            : activity.type === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
