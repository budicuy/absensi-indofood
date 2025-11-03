import { create } from "zustand";
import { toast } from "react-hot-toast";

// ===== TYPE DEFINITIONS =====

export interface Karyawan {
  id: number;
  nik: string;
  namaLengkap: string;
  alamat: string;
  noTelepon: string;
  tanggalMasuk: string | number | Date;
  departemenId: number;
  vendorId: number;
  departemenNama: string;
  vendorNama: string;
}

export interface KaryawanFormData {
  id: string;
  nik: string;
  namaLengkap: string;
  alamat: string;
  noTelepon: string;
  tanggalMasuk: string;
  departemenId: string;
  vendorId: string;
}

interface Departemen {
  id: string;
  namaDepartemen: string;
}

interface Vendor {
  id: string;
  namaVendor: string;
}

interface KaryawanStore {
  // Data state
  karyawans: Karyawan[];
  departemens: Departemen[];
  vendors: Vendor[];
  loading: boolean;

  // UI state
  formOpen: boolean;
  selectedKaryawan: KaryawanFormData | null;
  deleteDialogOpen: boolean;
  karyawanToDelete: string | null;

  // Search & Sort state
  searchQuery: string;
  sortConfig: {
    key: string | null;
    direction: "ASC" | "DESC";
  };

  // Actions - Data
  fetchData: () => Promise<void>;
  deleteKaryawan: (id: number) => Promise<void>;

  // Actions - UI
  setFormOpen: (open: boolean) => void;
  setSelectedKaryawan: (karyawan: KaryawanFormData | null) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setKaryawanToDelete: (id: string | null) => void;
  openEditForm: (karyawan: Karyawan) => void;
  openAddForm: () => void;
  openDeleteDialog: (id: number) => void;

  // Actions - Search & Sort
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: {
    key: string | null;
    direction: "ASC" | "DESC";
  }) => void;
  handleSort: (key: string) => void;

  // Computed
  getFilteredAndSortedKaryawans: () => Karyawan[];
}

// ===== GRAPHQL QUERIES =====

const GRAPHQL_QUERIES = {
  GET_ALL: `
    query {
      karyawans {
        id
        nik
        NamaLengkap
        alamat
        noTelp
        tanggalMasukKaryawan
        departemenId
        vendorId
        departemen { namaDepartemen }
        vendor { namaVendor }
      }
      departemens { id namaDepartemen }
      vendors { id namaVendor }
    }
  `,
  DELETE: `
    mutation DeleteKaryawan($id: String!) {
      deleteKaryawan(id: $id) { id }
    }
  `,
};

// ===== HELPER FUNCTIONS =====

/**
 * Format date for input field (YYYY-MM-DD)
 */
const formatDateForInput = (dateString: string | number | Date): string => {
  if (!dateString) return "";

  try {
    let date: Date;

    if (typeof dateString === "string") {
      const timestamp = Number(dateString);
      if (!Number.isNaN(timestamp) && timestamp > 0) {
        date = new Date(timestamp);
      } else {
        date = new Date(dateString);
      }
    } else {
      date = new Date(dateString);
    }

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

/**
 * Transform GraphQL response to Karyawan interface
 */
const transformKaryawan = (raw: {
  id: string;
  nik: string;
  NamaLengkap: string;
  alamat: string;
  noTelp: string;
  tanggalMasukKaryawan: string | number | Date;
  departemenId: string;
  vendorId: string;
  departemen: { namaDepartemen: string };
  vendor: { namaVendor: string };
}): Karyawan => ({
  id: Number(raw.id),
  nik: raw.nik,
  namaLengkap: raw.NamaLengkap,
  alamat: raw.alamat,
  noTelepon: raw.noTelp,
  tanggalMasuk: raw.tanggalMasukKaryawan,
  departemenId: Number(raw.departemenId),
  vendorId: Number(raw.vendorId),
  departemenNama: raw.departemen.namaDepartemen,
  vendorNama: raw.vendor.namaVendor,
});

// ===== ZUSTAND STORE =====

export const useKaryawanStore = create<KaryawanStore>((set, get) => ({
  // ===== INITIAL STATE =====
  karyawans: [],
  departemens: [],
  vendors: [],
  loading: true,
  formOpen: false,
  selectedKaryawan: null,
  deleteDialogOpen: false,
  karyawanToDelete: null,
  searchQuery: "",
  sortConfig: { key: null, direction: "ASC" },

  // ===== DATA ACTIONS =====
  fetchData: async () => {
    try {
      set({ loading: true });

      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: GRAPHQL_QUERIES.GET_ALL }),
      });

      const result = await response.json();

      if (result.data) {
        set({
          karyawans: result.data.karyawans.map(transformKaryawan) || [],
          departemens: result.data.departemens || [],
          vendors: result.data.vendors || [],
        });
      }
    } catch (error) {
      toast.error("Gagal memuat data");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  deleteKaryawan: async (id: number) => {
    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GRAPHQL_QUERIES.DELETE,
          variables: { id: id.toString() },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        toast.error(result.errors[0].message);
        return;
      }

      toast.success("Karyawan berhasil dihapus");
      await get().fetchData();
    } catch (error) {
      toast.error("Gagal menghapus karyawan");
      console.error(error);
    } finally {
      set({ deleteDialogOpen: false, karyawanToDelete: null });
    }
  },

  // ===== UI ACTIONS =====
  setFormOpen: (open) => set({ formOpen: open }),
  setSelectedKaryawan: (karyawan) => set({ selectedKaryawan: karyawan }),
  setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),
  setKaryawanToDelete: (id) => set({ karyawanToDelete: id }),

  openEditForm: (karyawan: Karyawan) => {
    const karyawanForForm: KaryawanFormData = {
      id: karyawan.id.toString(),
      nik: karyawan.nik,
      namaLengkap: karyawan.namaLengkap,
      alamat: karyawan.alamat,
      noTelepon: karyawan.noTelepon,
      tanggalMasuk: formatDateForInput(karyawan.tanggalMasuk),
      departemenId: karyawan.departemenId.toString(),
      vendorId: karyawan.vendorId.toString(),
    };
    set({ selectedKaryawan: karyawanForForm, formOpen: true });
  },

  openAddForm: () => {
    set({ selectedKaryawan: null, formOpen: true });
  },

  openDeleteDialog: (id: number) => {
    set({ karyawanToDelete: id.toString(), deleteDialogOpen: true });
  },

  // ===== SEARCH & SORT ACTIONS =====
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortConfig: (config) => set({ sortConfig: config }),

  handleSort: (key: string) => {
    const { sortConfig } = get();
    const direction: "ASC" | "DESC" =
      sortConfig.key === key && sortConfig.direction === "ASC" ? "DESC" : "ASC";
    set({ sortConfig: { key, direction } });
  },

  // ===== COMPUTED VALUES =====
  getFilteredAndSortedKaryawans: () => {
    const { karyawans, searchQuery, sortConfig } = get();
    let filtered = [...karyawans];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (k) =>
          k.nik.toLowerCase().includes(query) ||
          k.namaLengkap.toLowerCase().includes(query) ||
          k.departemenNama.toLowerCase().includes(query) ||
          k.vendorNama.toLowerCase().includes(query) ||
          k.noTelepon.includes(searchQuery),
      );
    }

    // Sort data
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: string | number = "";
        let bValue: string | number = "";

        const key = sortConfig.key;

        if (key === "departemenNama") {
          aValue = a.departemenNama;
          bValue = b.departemenNama;
        } else if (key === "vendorNama") {
          aValue = a.vendorNama;
          bValue = b.vendorNama;
        } else if (key === "tanggalMasuk") {
          aValue = new Date(
            typeof a.tanggalMasuk === "string" &&
              !Number.isNaN(Number(a.tanggalMasuk))
              ? Number(a.tanggalMasuk)
              : a.tanggalMasuk,
          ).getTime();
          bValue = new Date(
            typeof b.tanggalMasuk === "string" &&
              !Number.isNaN(Number(b.tanggalMasuk))
              ? Number(b.tanggalMasuk)
              : b.tanggalMasuk,
          ).getTime();
        } else if (key) {
          aValue = a[key as keyof Karyawan] as string;
          bValue = b[key as keyof Karyawan] as string;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ASC" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ASC" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  },
}));
