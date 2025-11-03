import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-4">
            Selamat datang, {session.user?.name || session.user?.username}!
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 font-medium">
              ✓ Login berhasil! Anda sudah masuk ke sistem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
