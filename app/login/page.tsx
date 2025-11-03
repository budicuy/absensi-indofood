"use client";

import { Loader2, Lock, LogIn, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append("username", formData.username);
    form.append("password", formData.password);

    startTransition(async () => {
      const result = await loginAction(form);

      if (result?.success) {
        toast.success(result.message, {
          duration: 2000,
          position: "top-center",
          style: {
            background: "#10b981",
            color: "#fff",
            fontWeight: "600",
          },
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else if (result?.message) {
        toast.error(result.message, {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#ef4444",
            color: "#fff",
            fontWeight: "600",
          },
        });
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform transition-all duration-500 hover:scale-105">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-tr from-purple-500 to-pink-500 mb-4 shadow-lg animate-pulse">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-white/80 text-sm">
              Silakan login untuk melanjutkan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-white/60 group-focus-within:text-white transition-colors duration-300" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Username"
                disabled={isPending}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-white/60 group-focus-within:text-white transition-colors duration-300" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
                disabled={isPending}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/70 text-sm">
              Sistem Absensi Indofood © 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
