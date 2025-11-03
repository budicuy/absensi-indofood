"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  karyawanSchema,
  type KaryawanFormData,
} from "@/lib/validations/karyawan";
import { toast } from "react-hot-toast";
import type { KaryawanFormData as StoreKaryawanFormData } from "@/lib/stores/karyawan-store";
import type { DepartemenModel } from "@/lib/generated/prisma/models/Departemen";
import type { VendorModel } from "@/lib/generated/prisma/models/Vendor";

interface KaryawanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  karyawan?: StoreKaryawanFormData | null;
  departemens: DepartemenModel[];
  vendors: VendorModel[];
  onSuccess: () => void;
}

export function KaryawanForm({
  open,
  onOpenChange,
  karyawan,
  departemens,
  vendors,
  onSuccess,
}: KaryawanFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [formData, setFormData] = React.useState<KaryawanFormData>({
    nik: "",
    NamaLengkap: "",
    alamat: "",
    noTelp: "",
    tanggalMasukKaryawan: "",
    departemenId: "",
    vendorId: "",
  });

  React.useEffect(() => {
    if (karyawan) {
      setFormData({
        nik: karyawan.nik,
        NamaLengkap: karyawan.NamaLengkap,
        alamat: karyawan.alamat,
        noTelp: karyawan.noTelp,
        tanggalMasukKaryawan: karyawan.tanggalMasukKaryawan,
        departemenId: karyawan.departemenId,
        vendorId: karyawan.vendorId,
      });
    } else {
      setFormData({
        nik: "",
        NamaLengkap: "",
        alamat: "",
        noTelp: "",
        tanggalMasukKaryawan: "",
        departemenId: "",
        vendorId: "",
      });
    }
    setErrors({});
  }, [karyawan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = karyawanSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const query = karyawan
        ? `mutation UpdateKaryawan($id: String!, $input: UpdateKaryawanInput!) {
            updateKaryawan(id: $id, input: $input) {
              id
            }
          }`
        : `mutation CreateKaryawan($input: CreateKaryawanInput!) {
            createKaryawan(input: $input) {
              id
            }
          }`;

      // Prepare input data
      let inputData: Record<string, string> = { ...formData };

      // For update, only send changed fields
      if (karyawan) {
        const changedFields: Record<string, string> = {};

        if (formData.nik !== karyawan.nik) changedFields.nik = formData.nik;
        if (formData.NamaLengkap !== karyawan.NamaLengkap)
          changedFields.NamaLengkap = formData.NamaLengkap;
        if (formData.alamat !== karyawan.alamat)
          changedFields.alamat = formData.alamat;
        if (formData.noTelp !== karyawan.noTelp)
          changedFields.noTelp = formData.noTelp;
        if (formData.departemenId !== karyawan.departemenId)
          changedFields.departemenId = formData.departemenId;
        if (formData.vendorId !== karyawan.vendorId)
          changedFields.vendorId = formData.vendorId;

        // Only include tanggalMasukKaryawan if it changed
        if (formData.tanggalMasukKaryawan !== karyawan.tanggalMasukKaryawan) {
          changedFields.tanggalMasukKaryawan = formData.tanggalMasukKaryawan;
        }

        inputData = changedFields;
      }

      const variables = karyawan
        ? { id: karyawan.id, input: inputData }
        : { input: inputData };

      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        toast.error(result.errors[0].message);
        return;
      }

      toast.success(
        karyawan
          ? "Karyawan berhasil diupdate"
          : "Karyawan berhasil ditambahkan",
      );
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Terjadi kesalahan");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {karyawan ? "Edit Karyawan" : "Tambah Karyawan"}
          </DialogTitle>
          <DialogDescription>
            {karyawan
              ? "Ubah data karyawan yang sudah ada"
              : "Tambahkan data karyawan baru ke sistem"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nik">NIK</Label>
              <Input
                id="nik"
                value={formData.nik}
                onChange={(e) =>
                  setFormData({ ...formData, nik: e.target.value })
                }
                placeholder="Masukkan NIK"
              />
              {errors.nik && (
                <p className="text-sm text-destructive">{errors.nik}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="NamaLengkap">Nama Lengkap</Label>
              <Input
                id="NamaLengkap"
                value={formData.NamaLengkap}
                onChange={(e) =>
                  setFormData({ ...formData, NamaLengkap: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
              />
              {errors.NamaLengkap && (
                <p className="text-sm text-destructive">{errors.NamaLengkap}</p>
              )}
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                id="alamat"
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
                placeholder="Masukkan alamat"
              />
              {errors.alamat && (
                <p className="text-sm text-destructive">{errors.alamat}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="noTelp">Nomor Telepon</Label>
              <Input
                id="noTelp"
                value={formData.noTelp}
                onChange={(e) =>
                  setFormData({ ...formData, noTelp: e.target.value })
                }
                placeholder="Masukkan nomor telepon"
              />
              {errors.noTelp && (
                <p className="text-sm text-destructive">{errors.noTelp}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggalMasukKaryawan">Tanggal Masuk</Label>
              <Input
                id="tanggalMasukKaryawan"
                type="date"
                value={formData.tanggalMasukKaryawan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tanggalMasukKaryawan: e.target.value,
                  })
                }
              />
              {errors.tanggalMasukKaryawan && (
                <p className="text-sm text-destructive">
                  {errors.tanggalMasukKaryawan}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departemenId">Departemen</Label>
              <Select
                value={formData.departemenId}
                onValueChange={(value) =>
                  setFormData({ ...formData, departemenId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih departemen" />
                </SelectTrigger>
                <SelectContent>
                  {departemens.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.namaDepartemen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departemenId && (
                <p className="text-sm text-destructive">
                  {errors.departemenId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendorId">Vendor</Label>
              <Select
                value={formData.vendorId}
                onValueChange={(value) =>
                  setFormData({ ...formData, vendorId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.namaVendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vendorId && (
                <p className="text-sm text-destructive">{errors.vendorId}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
