"use client";

import * as React from "react";
import {
  Pencil,
  Trash2,
  Plus,
  ArrowUpDown,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KaryawanForm } from "@/components/karyawan-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useKaryawanStore } from "@/lib/stores/karyawan-store";
import { formatDate } from "@/lib/utils/date";

export default function KaryawanPage() {
  // Zustand store
  const {
    karyawans,
    departemens,
    vendors,
    loading,
    formOpen,
    selectedKaryawan,
    deleteDialogOpen,
    karyawanToDelete,
    searchQuery,
    sortConfig,
    fetchData,
    deleteKaryawan,
    setFormOpen,
    setDeleteDialogOpen,
    setSearchQuery,
    openEditForm,
    openAddForm,
    openDeleteDialog,
    handleSort,
    getFilteredAndSortedKaryawans,
  } = useKaryawanStore();

  // Computed data
  const filteredAndSortedKaryawans = getFilteredAndSortedKaryawans();

  // Load data on mount
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleDeleteConfirm = async () => {
    if (!karyawanToDelete) return;
    await deleteKaryawan(karyawanToDelete);
  };

  const handleFormSuccess = async () => {
    await fetchData();
    setFormOpen(false);
  };

  // Render sort icon
  const renderSortIcon = (key: keyof (typeof karyawans)[0]) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Karyawan</h1>
          <p className="text-muted-foreground">Kelola data karyawan Indofood</p>
        </div>
        <Button onClick={openAddForm} size="lg" className="shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Karyawan
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Karyawan</CardTitle>
              <CardDescription>
                Total {filteredAndSortedKaryawans.length} dari{" "}
                {karyawans.length} karyawan
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari NIK, nama, departemen, vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] pl-6">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("nik")}
                      className="h-8 data-[state=open]:bg-accent"
                    >
                      NIK
                      {renderSortIcon("nik")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("NamaLengkap")}
                      className="-ml-4 h-8"
                    >
                      Nama Lengkap
                      {renderSortIcon("NamaLengkap")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[180px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("departemen")}
                      className="-ml-4 h-8"
                    >
                      Departemen
                      {renderSortIcon("departemen")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("vendor")}
                      className="-ml-4 h-8"
                    >
                      Vendor
                      {renderSortIcon("vendor")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[130px]">No. Telepon</TableHead>
                  <TableHead className="w-40">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("tanggalMasukKaryawan")}
                      className="-ml-4 h-8"
                    >
                      Tanggal Masuk
                      {renderSortIcon("tanggalMasukKaryawan")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[100px] pl-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedKaryawans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8" />
                        <p className="text-sm">
                          {searchQuery
                            ? "Tidak ada hasil pencarian"
                            : "Tidak ada data karyawan"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedKaryawans.map((karyawan) => (
                    <TableRow key={karyawan.id}>
                      <TableCell className="font-mono font-medium pl-6">
                        {karyawan.nik}
                      </TableCell>
                      <TableCell className="font-medium">
                        {karyawan.NamaLengkap}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          {karyawan.departemen.namaDepartemen}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          {karyawan.vendor.namaVendor}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {karyawan.noTelp}
                      </TableCell>
                      <TableCell>
                        {karyawan.tanggalMasukKaryawan
                          ? formatDate(karyawan.tanggalMasukKaryawan)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditForm(karyawan)}
                            className="h-9 w-9 p-0 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(karyawan.id)}
                            className="h-9 w-9 p-0 bg-red-50 border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <KaryawanForm
        open={formOpen}
        onOpenChange={setFormOpen}
        karyawan={selectedKaryawan}
        departemens={departemens}
        vendors={vendors}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus karyawan ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
