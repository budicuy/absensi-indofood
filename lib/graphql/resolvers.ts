import { prisma } from "@/lib/prisma";
import { GraphQLError } from "graphql";

interface CreateKaryawanInput {
  nik: string;
  NamaLengkap: string;
  alamat: string;
  noTelp: string;
  tanggalMasukKaryawan: string;
  departemenId: string;
  vendorId: string;
}

interface UpdateKaryawanInput {
  nik?: string;
  NamaLengkap?: string;
  alamat?: string;
  noTelp?: string;
  tanggalMasukKaryawan?: string;
  departemenId?: string;
  vendorId?: string;
}

export const resolvers = {
  Query: {
    karyawan: async (_: unknown, { id }: { id: string }) => {
      const karyawan = await prisma.karyawan.findUnique({
        where: { id },
        include: {
          departemen: true,
          vendor: true,
        },
      });
      if (!karyawan) throw new GraphQLError("Karyawan tidak ditemukan");
      return karyawan;
    },

    karyawans: async () => {
      return await prisma.karyawan.findMany({
        include: {
          departemen: true,
          vendor: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },

    departemens: async () => {
      return await prisma.departemen.findMany({
        orderBy: { namaDepartemen: "asc" },
      });
    },

    vendors: async () => {
      return await prisma.vendor.findMany({
        orderBy: { namaVendor: "asc" },
      });
    },
  },

  Mutation: {
    createKaryawan: async (_: unknown, { input }: { input: CreateKaryawanInput }) => {
      // Validasi NIK unik
      const existing = await prisma.karyawan.findUnique({
        where: { nik: input.nik },
      });
      if (existing) {
        throw new GraphQLError("NIK sudah terdaftar");
      }

      // Validasi no telp unik
      const existingTelp = await prisma.karyawan.findUnique({
        where: { noTelp: input.noTelp },
      });
      if (existingTelp) {
        throw new GraphQLError("Nomor telepon sudah terdaftar");
      }

      return await prisma.karyawan.create({
        data: {
          ...input,
          tanggalMasukKaryawan: new Date(input.tanggalMasukKaryawan),
        },
        include: {
          departemen: true,
          vendor: true,
        },
      });
    },

    updateKaryawan: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateKaryawanInput }
    ) => {
      // Validasi NIK unik jika diubah
      if (input.nik) {
        const existing = await prisma.karyawan.findFirst({
          where: { nik: input.nik, NOT: { id } },
        });
        if (existing) {
          throw new GraphQLError("NIK sudah terdaftar");
        }
      }

      // Validasi no telp unik jika diubah
      if (input.noTelp) {
        const existingTelp = await prisma.karyawan.findFirst({
          where: { noTelp: input.noTelp, NOT: { id } },
        });
        if (existingTelp) {
          throw new GraphQLError("Nomor telepon sudah terdaftar");
        }
      }

      // Prepare data object
      const { tanggalMasukKaryawan, ...restInput } = input;
      const updateData: Record<string, unknown> = { ...restInput };

      // Only add tanggalMasukKaryawan if it's provided and valid
      if (tanggalMasukKaryawan) {
        const date = new Date(tanggalMasukKaryawan);
        if (!Number.isNaN(date.getTime())) {
          updateData.tanggalMasukKaryawan = date;
        }
      }

      return await prisma.karyawan.update({
        where: { id },
        data: updateData,
        include: {
          departemen: true,
          vendor: true,
        },
      });
    },

    deleteKaryawan: async (_: unknown, { id }: { id: string }) => {
      return await prisma.karyawan.delete({
        where: { id },
        include: {
          departemen: true,
          vendor: true,
        },
      });
    },
  },
};
