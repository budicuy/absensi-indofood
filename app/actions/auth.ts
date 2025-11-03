"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function authenticate(
    prevState: string | undefined, // Untuk menampung pesan error sebelumnya
    formData: FormData
) {
    try {
        // Panggil fungsi signIn dengan provider 'credentials'
        await signIn("credentials", {
            // Ambil data dari form
            email: formData.get("username"),
            password: formData.get("password"),
            // Penting: setting redirect false agar error ditangani di Server Action
            redirect: false,
        });

        // Jika login berhasil, redirect ke halaman dashboard
        redirect("/dashboard");

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Login gagal. Email atau Password salah.";
                case "AccessDenied":
                    return "Akses ditolak. Silakan coba lagi.";
                default:

                    return "Terjadi error yang tidak diketahui.";
            }
        }
        throw error;
    }
}