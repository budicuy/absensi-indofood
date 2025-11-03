"use client";

import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { logoutAction } from "@/app/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  user?: {
    name?: string | null;
    username?: string;
    image?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAction();
      toast.success("Berhasil logout");
    } catch (error) {
      toast.error(
        `Gagal logout: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.username?.slice(0, 2).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="h-6 w-px bg-border" />

      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-2 hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image || undefined}
                alt={user?.name || "User"}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left text-sm md:block">
              <p className="font-medium">{user?.name || user?.username}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
