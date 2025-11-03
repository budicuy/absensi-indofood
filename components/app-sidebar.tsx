"use client";

import {
    Building2,
    ChevronDown,
    Clock,
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    UserCircle,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { logoutAction } from "@/app/actions/auth";

const menuItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
    },
    {
        title: "Master Data",
        icon: Users,
        items: [
            { title: "Data Karyawan", url: "/dashboard/karyawan" },
            { title: "Data User", url: "/dashboard/users" },
            { title: "Data Jam Kerja", url: "/dashboard/jam-kerja" },
            { title: "Data Alasan Lembur", url: "/dashboard/alasan-lembur" },
            { title: "Data Departemen", url: "/dashboard/departemen" },
            { title: "Data Vendor", url: "/dashboard/vendor" },
            { title: "Data Gaji Pokok", url: "/dashboard/gaji-pokok" },
        ],
    },
    {
        title: "Absensi",
        icon: Clock,
        items: [
            { title: "Tambah Absensi", url: "/dashboard/absensi/tambah" },
            { title: "Daftar Data Absensi", url: "/dashboard/absensi" },
        ],
    },
    {
        title: "Work Schedule Overtime",
        icon: Building2,
        items: [
            { title: "Daftar Data Overtime", url: "/dashboard/overtime" },
            { title: "Tambah Data Overtime", url: "/dashboard/overtime/tambah" },
        ],
    },
    {
        title: "Laporan",
        icon: FileText,
        items: [
            {
                title: "Laporan Absensi Karyawan",
                url: "/dashboard/laporan/absensi",
            },
            { title: "Laporan Overtime", url: "/dashboard/laporan/overtime" },
            {
                title: "Rekap Data Laporan Overtime",
                url: "/dashboard/laporan/rekap-overtime",
            },
        ],
    },
];

export function AppSidebar({ user }: { user: any }) {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = React.useState<string[]>([]);

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) =>
            prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title],
        );
    };

    const handleLogout = async () => {
        await logoutAction();
    };

    return (
        <Sidebar>
            <SidebarHeader className="border-b p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <Building2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Indofood</span>
                        <span className="text-xs text-muted-foreground">
                            Sistem Absensi
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.items ? (
                                <>
                                    <SidebarMenuButton
                                        onClick={() => toggleMenu(item.title)}
                                        className="w-full justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </div>
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${openMenus.includes(item.title) ? "rotate-180" : ""
                                                }`}
                                        />
                                    </SidebarMenuButton>
                                    {openMenus.includes(item.title) && (
                                        <SidebarMenuSub>
                                            {item.items.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link
                                                            href={subItem.url}
                                                            className={
                                                                pathname === subItem.url
                                                                    ? "bg-accent text-accent-foreground"
                                                                    : ""
                                                            }
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    )}
                                </>
                            ) : (
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={item.url}
                                        className={
                                            pathname === item.url
                                                ? "bg-accent text-accent-foreground"
                                                : ""
                                        }
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <div className="mb-2 text-center text-xs text-muted-foreground">
                    © 2025 Indofood. All rights reserved.
                </div>
                <Separator className="my-2" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.image || ""} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-1 flex-col items-start text-left">
                                <span className="text-sm font-medium">
                                    {user?.name || user?.username}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {user?.username}
                                </span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/profile">
                                <UserCircle className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
