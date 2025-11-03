import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date";
import { TABLE_CONFIG } from "@/lib/constants/karyawan";
import type { KaryawanWithRelations } from "@/lib/stores/karyawan-store";

interface KaryawanTableProps {
  karyawans: KaryawanWithRelations[];
  sortField: string | null;
  sortDirection: "ASC" | "DESC";
  onSort: (field: string) => void;
  onEdit: (karyawan: KaryawanWithRelations) => void;
  onDelete: (id: string) => void;
}

/**
 * Generate consistent color based on string hash
 */
const getColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Return tailwind-compatible color classes with better styling
  const colors = [
    "bg-blue-100 text-blue-700 border-blue-300 font-medium",
    "bg-green-100 text-green-700 border-green-300 font-medium",
    "bg-purple-100 text-purple-700 border-purple-300 font-medium",
    "bg-orange-100 text-orange-700 border-orange-300 font-medium",
    "bg-pink-100 text-pink-700 border-pink-300 font-medium",
    "bg-indigo-100 text-indigo-700 border-indigo-300 font-medium",
    "bg-cyan-100 text-cyan-700 border-cyan-300 font-medium",
    "bg-rose-100 text-rose-700 border-rose-300 font-medium",
    "bg-amber-100 text-amber-700 border-amber-300 font-medium",
    "bg-teal-100 text-teal-700 border-teal-300 font-medium",
    "bg-emerald-100 text-emerald-700 border-emerald-300 font-medium",
    "bg-violet-100 text-violet-700 border-violet-300 font-medium",
    "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 font-medium",
    "bg-lime-100 text-lime-700 border-lime-300 font-medium",
    "bg-sky-100 text-sky-700 border-sky-300 font-medium",
  ];

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Data table component for displaying Karyawan records
 */
export function KaryawanTable({
  karyawans,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: KaryawanTableProps) {
  const renderSortIcon = (columnName: string) => {
    if (sortField !== columnName) return null;
    return sortDirection === "ASC" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  if (karyawans.length === 0) {
    return (
      <div className="space-y-4">
        {/* Empty state for mobile */}
        <div className="md:hidden rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            {TABLE_CONFIG.EMPTY_MESSAGE.NO_RESULT}
          </p>
        </div>

        {/* Empty state for desktop */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Object.values(TABLE_CONFIG.COLUMNS).map((col) => (
                  <TableHead key={col.label} className={col.width}>
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={Object.keys(TABLE_CONFIG.COLUMNS).length}
                  className="h-24 text-center"
                >
                  {TABLE_CONFIG.EMPTY_MESSAGE.NO_RESULT}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {karyawans.map((karyawan) => (
          <Card key={karyawan.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-3">
              {/* Header with NIK and Actions */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    NIK
                  </p>
                  <p className="font-semibold">{karyawan.nik}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(karyawan)}
                    className="h-8 w-8 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(karyawan.id)}
                    className="h-8 w-8 bg-red-500/10 hover:bg-red-500/20 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  Nama Lengkap
                </p>
                <p className="font-medium">{karyawan.NamaLengkap}</p>
              </div>

              {/* Departemen & Vendor */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    Departemen
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      karyawan.departemen?.namaDepartemen
                        ? getColorFromString(karyawan.departemen.namaDepartemen)
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }
                  >
                    {karyawan.departemen?.namaDepartemen || "-"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    Vendor
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      karyawan.vendor?.namaVendor
                        ? getColorFromString(
                            `vendor-${karyawan.vendor.namaVendor}`,
                          )
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }
                  >
                    {karyawan.vendor?.namaVendor || "-"}
                  </Badge>
                </div>
              </div>

              {/* Phone & Date */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    No. Telepon
                  </p>
                  <p className="text-sm">{karyawan.noTelp}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    Tanggal Masuk
                  </p>
                  <p className="text-sm">
                    {formatDate(karyawan.tanggalMasukKaryawan)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_CONFIG.COLUMNS.NIK.width}>
                <button
                  type="button"
                  onClick={() => onSort("nik")}
                  className="flex items-center hover:text-foreground transition-colors font-semibold"
                >
                  {TABLE_CONFIG.COLUMNS.NIK.label}
                  {renderSortIcon("nik")}
                </button>
              </TableHead>
              <TableHead className={TABLE_CONFIG.COLUMNS.NAMA.width}>
                <button
                  type="button"
                  onClick={() => onSort("NamaLengkap")}
                  className="flex items-center hover:text-foreground transition-colors font-semibold"
                >
                  {TABLE_CONFIG.COLUMNS.NAMA.label}
                  {renderSortIcon("NamaLengkap")}
                </button>
              </TableHead>
              <TableHead className={TABLE_CONFIG.COLUMNS.DEPARTEMEN.width}>
                <button
                  type="button"
                  onClick={() => onSort("departemenNama")}
                  className="flex items-center hover:text-foreground transition-colors font-semibold"
                >
                  {TABLE_CONFIG.COLUMNS.DEPARTEMEN.label}
                  {renderSortIcon("departemenNama")}
                </button>
              </TableHead>
              <TableHead className={TABLE_CONFIG.COLUMNS.VENDOR.width}>
                <button
                  type="button"
                  onClick={() => onSort("vendorNama")}
                  className="flex items-center hover:text-foreground transition-colors font-semibold"
                >
                  {TABLE_CONFIG.COLUMNS.VENDOR.label}
                  {renderSortIcon("vendorNama")}
                </button>
              </TableHead>
              <TableHead className={TABLE_CONFIG.COLUMNS.TELEPON.width}>
                {TABLE_CONFIG.COLUMNS.TELEPON.label}
              </TableHead>
              <TableHead className={TABLE_CONFIG.COLUMNS.TANGGAL.width}>
                <button
                  type="button"
                  onClick={() => onSort("tanggalMasukKaryawan")}
                  className="flex items-center hover:text-foreground transition-colors font-semibold"
                >
                  {TABLE_CONFIG.COLUMNS.TANGGAL.label}
                  {renderSortIcon("tanggalMasukKaryawan")}
                </button>
              </TableHead>
              <TableHead className={TABLE_CONFIG.COLUMNS.AKSI.width}>
                {TABLE_CONFIG.COLUMNS.AKSI.label}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {karyawans.map((karyawan) => (
              <TableRow key={karyawan.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{karyawan.nik}</TableCell>
                <TableCell>{karyawan.NamaLengkap}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      karyawan.departemen?.namaDepartemen
                        ? getColorFromString(karyawan.departemen.namaDepartemen)
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }
                  >
                    {karyawan.departemen?.namaDepartemen || "-"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      karyawan.vendor?.namaVendor
                        ? getColorFromString(
                            `vendor-${karyawan.vendor.namaVendor}`,
                          )
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }
                  >
                    {karyawan.vendor?.namaVendor || "-"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {karyawan.noTelp}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(karyawan.tanggalMasukKaryawan)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(karyawan)}
                      className="h-8 w-8 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(karyawan.id)}
                      className="h-8 w-8 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
