"use client";

import {
  CalendarCheck,
  Clock,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Building2,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

import { StatCard } from "@/components/stat-card";
import { AttendanceChart } from "@/components/charts/attendance-chart";
import { OvertimeChart } from "@/components/charts/overtime-chart";
import { DepartmentChart } from "@/components/charts/department-chart";
import { ProductivityChart } from "@/components/charts/productivity-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Karyawan",
    value: "1,234",
    description: "Karyawan aktif",
    icon: Users,
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Hadir Hari Ini",
    value: "1,180",
    description: "95.6% kehadiran",
    icon: UserCheck,
    trend: { value: 2.5, isPositive: true },
  },
  {
    title: "Izin/Sakit",
    value: "42",
    description: "3.4% dari total",
    icon: CalendarCheck,
    trend: { value: -1.2, isPositive: false },
  },
  {
    title: "Alpha",
    value: "12",
    description: "1.0% dari total",
    icon: UserX,
    trend: { value: -0.5, isPositive: true },
  },
  {
    title: "Overtime Bulan Ini",
    value: "314",
    description: "Jam overtime",
    icon: Clock,
    trend: { value: 8.3, isPositive: true },
  },
  {
    title: "Total Departemen",
    value: "18",
    description: "Departemen aktif",
    icon: Building2,
  },
  {
    title: "Rata-rata Gaji",
    value: "Rp 8.5jt",
    description: "Per karyawan/bulan",
    icon: DollarSign,
    trend: { value: 5.2, isPositive: true },
  },
  {
    title: "Produktivitas",
    value: "94%",
    description: "Target tercapai",
    icon: TrendingUp,
    trend: { value: 3.1, isPositive: true },
  },
];

const recentActivity = [
  {
    name: "John Doe",
    action: "Clock In",
    time: "08:00",
    department: "IT",
    status: "on-time",
  },
  {
    name: "Jane Smith",
    action: "Clock In",
    time: "08:15",
    department: "HR",
    status: "late",
  },
  {
    name: "Bob Johnson",
    action: "Clock Out",
    time: "17:00",
    department: "Production",
    status: "on-time",
  },
  {
    name: "Alice Williams",
    action: "Overtime",
    time: "18:30",
    department: "QC",
    status: "overtime",
  },
  {
    name: "Charlie Brown",
    action: "Clock In",
    time: "08:30",
    department: "Finance",
    status: "late",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Selamat datang di Sistem Absensi Indofood
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AttendanceChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <OvertimeChart />
        </motion.div>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DepartmentChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ProductivityChart />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terkini</CardTitle>
            <CardDescription>
              Aktivitas absensi karyawan hari ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {activity.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "on-time"
                          ? "default"
                          : activity.status === "late"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {activity.status === "on-time"
                        ? "Tepat Waktu"
                        : activity.status === "late"
                          ? "Terlambat"
                          : "Lembur"}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
