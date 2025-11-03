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

    // Pagination state
    currentPage,
    itemsPerPage,

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

    // Pagination actions
    setCurrentPage,
    setItemsPerPage,
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

  // ===== PAGINATION LOGIC =====
  const totalItems = filteredKaryawans.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedKaryawans = filteredKaryawans.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDepartemenId, filterVendorId, setCurrentPage]);

  // ===== EVENT HANDLERS =====
  const handleDeleteConfirm = () => {
    if (karyawanToDelete) {
      deleteKaryawan(karyawanToDelete);
    }
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchData();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                Menampilkan {startIndex + 1}-{Math.min(endIndex, totalItems)}{" "}
                dari {totalItems} karyawan
                {filteredKaryawans.length < karyawans.length &&
                  ` (difilter dari ${karyawans.length} total)`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Data per halaman:
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                </SelectContent>
              </Select>
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
            karyawans={paginatedKaryawans}
            sortField={sortConfig.key}
            sortDirection={sortConfig.direction}
            onSort={handleSort}
            onEdit={openEditForm}
            onDelete={openDeleteDialog}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-4 pt-4 border-t gap-4">
              <div className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>

                {/* Page Numbers */}
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  let startPage = Math.max(
                    1,
                    currentPage - Math.floor(maxVisible / 2),
                  );
                  const endPage = Math.min(
                    totalPages,
                    startPage + maxVisible - 1,
                  );

                  // Adjust start if we're near the end
                  if (endPage - startPage < maxVisible - 1) {
                    startPage = Math.max(1, endPage - maxVisible + 1);
                  }

                  // First page
                  if (startPage > 1) {
                    pages.push(
                      <Button
                        key={1}
                        variant={currentPage === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        className="w-10"
                      >
                        1
                      </Button>,
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span
                          key="dots1"
                          className="px-2 text-muted-foreground"
                        >
                          ...
                        </span>,
                      );
                    }
                  }

                  // Page numbers
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        className="w-10"
                      >
                        {i}
                      </Button>,
                    );
                  }

                  // Last page
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span
                          key="dots2"
                          className="px-2 text-muted-foreground"
                        >
                          ...
                        </span>,
                      );
                    }
                    pages.push(
                      <Button
                        key={totalPages}
                        variant={
                          currentPage === totalPages ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-10"
                      >
                        {totalPages}
                      </Button>,
                    );
                  }

                  return pages;
                })()}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
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
