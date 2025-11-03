"use client";

import { useEffect, useMemo } from "react";
import { Loader2, Plus, Search, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KaryawanForm } from "@/components/karyawan-form";
import { KaryawanTable } from "@/components/karyawan-table";
import { KaryawanDeleteDialog } from "@/components/karyawan-delete-dialog";
import { useKaryawanStore } from "@/lib/stores/karyawan-store";
import { TABLE_CONFIG, UI_TEXT } from "@/lib/constants/karyawan";

/**
 * Karyawan (Employee) master data page
 *
 * Features:
 * - Create, Read, Update, Delete operations
 * - Search across NIK, name, department, and vendor
 * - Sortable columns with ASC/DESC toggle
 * - Modal form for add/edit
 * - Confirmation dialog for delete
 *
 * State management: Zustand store
 */
export default function KaryawanPage() {
  // ===== ZUSTAND STORE =====
  const {
    // Data state
    loading,
    departemens,
    vendors,
    karyawans,

    // UI state
    formOpen,
    selectedKaryawan,
    deleteDialogOpen,
    karyawanToDelete,

    // Search & Sort state
    searchQuery,
    sortConfig,

    // Filter state
    filterDepartemenId,
    filterVendorId,

    // Actions
    fetchData,
    deleteKaryawan,
    setFormOpen,
    setSearchQuery,
    handleSort,
    openEditForm,
    openAddForm,
    openDeleteDialog,
    setDeleteDialogOpen,

    // Filter actions
    setFilterDepartemenId,
    setFilterVendorId,
    clearFilters,
  } = useKaryawanStore();

  // ===== EFFECTS =====
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===== COMPUTE FILTERED DATA WITH useMemo =====
  // Langsung dari karyawans state, bukan dari computed function
  const filteredKaryawans = useMemo(() => {
    let result = [...karyawans];

    // Filter by departemen
    if (filterDepartemenId) {
      result = result.filter((k) => k.departemenId === filterDepartemenId);
    }

    // Filter by vendor
    if (filterVendorId) {
      result = result.filter((k) => k.vendorId === filterVendorId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (k) =>
          k.nik?.toLowerCase().includes(lowerQuery) ||
          k.NamaLengkap?.toLowerCase().includes(lowerQuery) ||
          k.departemen?.namaDepartemen?.toLowerCase().includes(lowerQuery) ||
          k.vendor?.namaVendor?.toLowerCase().includes(lowerQuery),
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue: string | number | Date = "";
        let bValue: string | number | Date = "";

        // Handle nested properties (departemenNama, vendorNama)
        if (sortConfig.key === "departemenNama") {
          aValue = a.departemen?.namaDepartemen || "";
          bValue = b.departemen?.namaDepartemen || "";
        } else if (sortConfig.key === "vendorNama") {
          aValue = a.vendor?.namaVendor || "";
          bValue = b.vendor?.namaVendor || "";
        } else {
          aValue = a[sortConfig.key as keyof typeof a] as
            | string
            | number
            | Date;
          bValue = b[sortConfig.key as keyof typeof b] as
            | string
            | number
            | Date;
        }

        if (aValue < bValue) return sortConfig.direction === "ASC" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ASC" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [karyawans, searchQuery, sortConfig, filterDepartemenId, filterVendorId]);

  // ===== EVENT HANDLERS =====
  const handleDeleteConfirm = () => {
    if (karyawanToDelete) {
      deleteKaryawan(Number(karyawanToDelete));
    }
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchData();
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {UI_TEXT.LOADING.MESSAGE}
          </p>
        </div>
      </div>
    );
  }

  // ===== MAIN RENDER =====
  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {UI_TEXT.PAGE.TITLE}
          </h1>
          <p className="text-muted-foreground">{UI_TEXT.PAGE.SUBTITLE}</p>
        </div>
        <Button onClick={openAddForm} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          {UI_TEXT.BUTTONS.ADD}
        </Button>
      </div>

      {/* Data Card */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{UI_TEXT.PAGE.CARD_TITLE}</CardTitle>
              <CardDescription>
                Total {filteredKaryawans.length} dari {karyawans.length}{" "}
                karyawan
              </CardDescription>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex gap-4 mt-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={TABLE_CONFIG.SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Departemen Filter */}
            <Select
              value={filterDepartemenId || "all"}
              onValueChange={(value) =>
                setFilterDepartemenId(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Semua Departemen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Departemen</SelectItem>
                {departemens.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.namaDepartemen}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Vendor Filter */}
            <Select
              value={filterVendorId || "all"}
              onValueChange={(value) =>
                setFilterVendorId(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Semua Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Vendor</SelectItem>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.namaVendor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {(filterDepartemenId || filterVendorId || searchQuery) && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Data Table */}
          <KaryawanTable
            karyawans={filteredKaryawans}
            sortField={sortConfig.key}
            sortDirection={sortConfig.direction}
            onSort={handleSort}
            onEdit={openEditForm}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <KaryawanForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleFormSuccess}
        karyawan={selectedKaryawan}
        departemens={departemens}
        vendors={vendors}
      />

      {/* Delete Confirmation Dialog */}
      <KaryawanDeleteDialog
        open={deleteDialogOpen}
        loading={false}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
