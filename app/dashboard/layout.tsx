import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <SidebarProvider>
            <AppSidebar user={session.user} />
            <SidebarInset className="flex min-h-screen flex-1 flex-col">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
