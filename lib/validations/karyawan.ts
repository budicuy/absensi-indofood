import { z } from "zod";

export const karyawanSchema = z.object({
  nik: z.string().min(1, "NIK wajib diisi"),
  NamaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  noTelp: z.string().min(1, "Nomor telepon wajib diisi"),
  tanggalMasukKaryawan: z.string().min(1, "Tanggal masuk wajib diisi"),
  departemenId: z.string().min(1, "Departemen wajib dipilih"),
  vendorId: z.string().min(1, "Vendor wajib dipilih"),
});

export type KaryawanFormData = z.infer<typeof karyawanSchema>;
