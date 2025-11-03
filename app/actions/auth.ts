"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return {
      success: false,
      message: "Username dan password harus diisi",
    };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/dashboard",
    });

    return {
      success: true,
      message: "Login Berhasil, sedang di arahkan ke Halaman dashboard.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Username atau password salah",
          };
        case "AccessDenied":
          return {
            success: false,
            message: "Akses ditolak",
          };
        default:
          return {
            success: false,
            message: "Terjadi kesalahan saat login",
          };
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
