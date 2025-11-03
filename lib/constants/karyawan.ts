export const TABLE_CONFIG = {
  COLUMNS: {
    NIK: { width: "w-[120px]", label: "NIK" },
    NAMA: { width: "w-[200px]", label: "Nama Lengkap" },
    DEPARTEMEN: { width: "w-[180px]", label: "Departemen" },
    VENDOR: { width: "w-[200px]", label: "Vendor" },
    TELEPON: { width: "w-[130px]", label: "No. Telepon" },
    TANGGAL: { width: "w-40", label: "Tanggal Masuk" },
    AKSI: { width: "w-[100px]", label: "Aksi" },
  },
  SEARCH_PLACEHOLDER: "Cari NIK, nama, departemen, vendor...",
  EMPTY_MESSAGE: {
    NO_DATA: "Tidak ada data karyawan",
    NO_RESULT: "Tidak ada hasil pencarian",
  },
} as const;

export const UI_TEXT = {
  PAGE: {
    TITLE: "Data Karyawan",
    SUBTITLE: "Kelola data karyawan Indofood",
    CARD_TITLE: "Daftar Karyawan",
  },
  BUTTONS: {
    ADD: "Tambah Karyawan",
    EDIT: "Edit",
    DELETE: "Hapus",
    CANCEL: "Batal",
  },
  LOADING: {
    MESSAGE: "Memuat data...",
  },
  DELETE_DIALOG: {
    TITLE: "Konfirmasi Hapus",
    DESCRIPTION:
      "Apakah Anda yakin ingin menghapus karyawan ini? Tindakan ini tidak dapat dibatalkan.",
  },
} as const;
