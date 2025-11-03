import { create } from "zustand";
import { toast } from "react-hot-toast";
import type { KaryawanModel } from "@/lib/generated/prisma/models/Karyawan";
import type { DepartemenModel } from "@/lib/generated/prisma/models/Departemen";
import type { VendorModel } from "@/lib/generated/prisma/models/Vendor";

// ===== TYPE DEFINITIONS =====

// Extended Karyawan type with computed fields from relations
export type KaryawanWithRelations = KaryawanModel & {
  departemen: DepartemenModel;
  vendor: VendorModel;
};

// Form data type for create/update operations
export interface KaryawanFormData {
  id?: string;
  nik: string;
  NamaLengkap: string;
  alamat: string;
  noTelp: string;
  tanggalMasukKaryawan: string;
  departemenId: string;
  vendorId: string;
}

interface KaryawanStore {
  // Data state
  karyawans: KaryawanWithRelations[];
  departemens: DepartemenModel[];
  vendors: VendorModel[];
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

  // Filter state
  filterDepartemenId: string | null;
  filterVendorId: string | null;

  // Actions - Data
  fetchData: () => Promise<void>;
  deleteKaryawan: (id: number) => Promise<void>;

  // Actions - UI
  setFormOpen: (open: boolean) => void;
  setSelectedKaryawan: (karyawan: KaryawanFormData | null) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setKaryawanToDelete: (id: string | null) => void;
  openEditForm: (karyawan: KaryawanWithRelations) => void;
  openAddForm: () => void;
  openDeleteDialog: (id: number) => void;

  // Actions - Search & Sort
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: {
    key: string | null;
    direction: "ASC" | "DESC";
  }) => void;
  handleSort: (key: string) => void;

  // Actions - Filter
  setFilterDepartemenId: (id: string | null) => void;
  setFilterVendorId: (id: string | null) => void;
  clearFilters: () => void;

  // Computed
  getFilteredAndSortedKaryawans: () => KaryawanWithRelations[];
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
  filterDepartemenId: null,
  filterVendorId: null,

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
        console.log(
          "✅ Data received:",
          result.data.karyawans?.length,
          "karyawans",
        );
        console.log("📦 First karyawan:", result.data.karyawans?.[0]);

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

  openEditForm: (karyawan: KaryawanWithRelations) => {
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

  // ===== FILTER ACTIONS =====
  setFilterDepartemenId: (id) => set({ filterDepartemenId: id }),
  setFilterVendorId: (id) => set({ filterVendorId: id }),
  clearFilters: () =>
    set({
      filterDepartemenId: null,
      filterVendorId: null,
      searchQuery: "",
    }),

  // ===== COMPUTED VALUES =====
  getFilteredAndSortedKaryawans: () => {
    const { karyawans, searchQuery, sortConfig } = get();
    let filtered = [...karyawans];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (k) =>
          k.nik?.toLowerCase().includes(query) ||
          k.NamaLengkap?.toLowerCase().includes(query) ||
          k.departemen?.namaDepartemen?.toLowerCase().includes(query) ||
          k.vendor?.namaVendor?.toLowerCase().includes(query) ||
          k.noTelp?.includes(searchQuery),
      );
    }

    // Sort data
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: string | number = "";
        let bValue: string | number = "";

        const key = sortConfig.key;

        if (key === "departemenNama") {
          aValue = a.departemen?.namaDepartemen || "";
          bValue = b.departemen?.namaDepartemen || "";
        } else if (key === "vendorNama") {
          aValue = a.vendor?.namaVendor || "";
          bValue = b.vendor?.namaVendor || "";
        } else if (key === "tanggalMasukKaryawan") {
          aValue = new Date(a.tanggalMasukKaryawan).getTime();
          bValue = new Date(b.tanggalMasukKaryawan).getTime();
        } else if (key) {
          aValue = a[key as keyof KaryawanWithRelations] as string;
          bValue = b[key as keyof KaryawanWithRelations] as string;
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
