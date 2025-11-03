export interface CreateKaryawanInput {
  nik: string;
  NamaLengkap: string;
  alamat: string;
  noTelp: string;
  tanggalMasukKaryawan: string;
  departemenId: string;
  vendorId: string;
}

export interface UpdateKaryawanInput {
  nik?: string;
  NamaLengkap?: string;
  alamat?: string;
  noTelp?: string;
  tanggalMasukKaryawan?: string;
  departemenId?: string;
  vendorId?: string;
}
