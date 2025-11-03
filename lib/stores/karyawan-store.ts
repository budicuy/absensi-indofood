import { create } from "zustand";
import { toast } from "react-hot-toast";

interface Karyawan {
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
}

interface KaryawanFormData {
  id: string;
  nik: string;
  NamaLengkap: string;
  alamat: string;
  noTelp: string;
  tanggalMasukKaryawan: string;
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
    key: keyof Karyawan | null;
    direction: "asc" | "desc";
  };

  // Actions - Data
  fetchData: () => Promise<void>;
  deleteKaryawan: (id: string) => Promise<void>;

  // Actions - UI
  setFormOpen: (open: boolean) => void;
  setSelectedKaryawan: (karyawan: KaryawanFormData | null) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setKaryawanToDelete: (id: string | null) => void;
  openEditForm: (karyawan: Karyawan) => void;
  openAddForm: () => void;
  openDeleteDialog: (id: string) => void;

  // Actions - Search & Sort
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: {
    key: keyof Karyawan | null;
    direction: "asc" | "desc";
  }) => void;
  handleSort: (key: keyof Karyawan) => void;

  // Computed
  getFilteredAndSortedKaryawans: () => Karyawan[];
}

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

// Helper function to format date for input
const formatDateForInput = (
  dateString: string | number | Date,
): string => {
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

export const useKaryawanStore = create<KaryawanStore>((set, get) => ({
  // Initial state
  karyawans: [],
  departemens: [],
  vendors: [],
  loading: true,
  formOpen: false,
  selectedKaryawan: null,
  deleteDialogOpen: false,
  karyawanToDelete: null,
  searchQuery: "",
  sortConfig: { key: null, direction: "asc" },

  // Data actions
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
          karyawans: result.data.karyawans || [],
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

  deleteKaryawan: async (id: string) => {
    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GRAPHQL_QUERIES.DELETE,
          variables: { id },
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

  // UI actions
  setFormOpen: (open) => set({ formOpen: open }),
  setSelectedKaryawan: (karyawan) => set({ selectedKaryawan: karyawan }),
  setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),
  setKaryawanToDelete: (id) => set({ karyawanToDelete: id }),

  openEditForm: (karyawan: Karyawan) => {
    const karyawanForForm: KaryawanFormData = {
      id: karyawan.id,
      nik: karyawan.nik,
      NamaLengkap: karyawan.NamaLengkap,
      alamat: karyawan.alamat,
      noTelp: karyawan.noTelp,
      tanggalMasukKaryawan: formatDateForInput(karyawan.tanggalMasukKaryawan),
      departemenId: karyawan.departemenId,
      vendorId: karyawan.vendorId,
    };
    set({ selectedKaryawan: karyawanForForm, formOpen: true });
  },

  openAddForm: () => {
    set({ selectedKaryawan: null, formOpen: true });
  },

  openDeleteDialog: (id: string) => {
    set({ karyawanToDelete: id, deleteDialogOpen: true });
  },

  // Search & Sort actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortConfig: (config) => set({ sortConfig: config }),

  handleSort: (key: keyof Karyawan) => {
    const { sortConfig } = get();
    const direction: "asc" | "desc" =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    set({ sortConfig: { key, direction } });
  },

  // Computed values
  getFilteredAndSortedKaryawans: () => {
    const { karyawans, searchQuery, sortConfig } = get();
    let filtered = [...karyawans];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (k) =>
          k.nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.NamaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.departemen.namaDepartemen
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          k.vendor.namaVendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.noTelp.includes(searchQuery),
      );
    }

    // Sort data
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: string | number = "";
        let bValue: string | number = "";

        const key = sortConfig.key;

        if (key === "departemen") {
          aValue = a.departemen.namaDepartemen;
          bValue = b.departemen.namaDepartemen;
        } else if (key === "vendor") {
          aValue = a.vendor.namaVendor;
          bValue = b.vendor.namaVendor;
        } else if (key === "tanggalMasukKaryawan") {
          aValue = new Date(
            typeof a.tanggalMasukKaryawan === "string" &&
              !Number.isNaN(Number(a.tanggalMasukKaryawan))
              ? Number(a.tanggalMasukKaryawan)
              : a.tanggalMasukKaryawan,
          ).getTime();
          bValue = new Date(
            typeof b.tanggalMasukKaryawan === "string" &&
              !Number.isNaN(Number(b.tanggalMasukKaryawan))
              ? Number(b.tanggalMasukKaryawan)
              : b.tanggalMasukKaryawan,
          ).getTime();
        } else if (key) {
          aValue = a[key] as string;
          bValue = b[key] as string;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  },
}));
