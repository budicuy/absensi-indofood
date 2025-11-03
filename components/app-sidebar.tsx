"use client";

import {
  BarChart3,
  Building2,
  Calendar,
  ChevronDown,
  Clock,
  DollarSign,
  FileText,
  LayoutDashboard,
  Plus,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Master Data",
    icon: Building2,
    items: [
      {
        title: "Data Karyawan",
        url: "/dashboard/master-data/karyawan",
        icon: Users,
      },
      { title: "Data User", url: "/dashboard/master-data/user", icon: Users },
      {
        title: "Data Jam Kerja",
        url: "/dashboard/master-data/jam-kerja",
        icon: Clock,
      },
      {
        title: "Data Alasan Lembur",
        url: "/dashboard/master-data/alasan-lembur",
        icon: FileText,
      },
      {
        title: "Data Departemen",
        url: "/dashboard/master-data/departemen",
        icon: Building2,
      },
      {
        title: "Data Vendor",
        url: "/dashboard/master-data/vendor",
        icon: Truck,
      },
      {
        title: "Data Gaji Pokok",
        url: "/dashboard/master-data/gaji-pokok",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Absensi",
    icon: Calendar,
    items: [
      { title: "Tambah Absensi", url: "/dashboard/absensi/tambah", icon: Plus },
      {
        title: "Daftar Data Absensi",
        url: "/dashboard/absensi/daftar",
        icon: FileText,
      },
    ],
  },
  {
    title: "Work Schedule Overtime",
    icon: Clock,
    items: [
      {
        title: "Daftar Data Overtime",
        url: "/dashboard/overtime/daftar",
        icon: FileText,
      },
      {
        title: "Tambah Data Overtime",
        url: "/dashboard/overtime/tambah",
        icon: Plus,
      },
    ],
  },
  {
    title: "Laporan",
    icon: BarChart3,
    items: [
      {
        title: "Laporan Absensi Karyawan",
        url: "/dashboard/laporan/absensi",
        icon: FileText,
      },
      {
        title: "Laporan Overtime",
        url: "/dashboard/laporan/overtime",
        icon: Clock,
      },
      {
        title: "Rekap Data Laporan Overtime",
        url: "/dashboard/laporan/rekap-overtime",
        icon: BarChart3,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Indofood</span>
                  <span className="truncate text-xs">Sistem Absensi</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
                item.items ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={pathname.includes(
                      item.title.toLowerCase().replace(" ", "-"),
                    )}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>
                                  {subItem.icon && (
                                    <subItem.icon className="size-4" />
                                  )}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-center text-xs text-muted-foreground">
          © 2025 Indofood. All rights reserved.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
