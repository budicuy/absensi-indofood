"use client";

import { useEffect } from "react";
import { Loader2, Plus, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

    // Computed
    getFilteredAndSortedKaryawans,
  } = useKaryawanStore();

  // Get filtered and sorted data
  const filteredKaryawans = getFilteredAndSortedKaryawans();

  // ===== EFFECTS =====
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={TABLE_CONFIG.SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
