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
import { formatDate } from "@/lib/utils/date";
import { TABLE_CONFIG } from "@/lib/constants/karyawan";
import type { Karyawan } from "@/lib/stores/karyawan-store";

interface KaryawanTableProps {
  karyawans: Karyawan[];
  sortField: string | null;
  sortDirection: "ASC" | "DESC";
  onSort: (field: string) => void;
  onEdit: (karyawan: Karyawan) => void;
  onDelete: (id: number) => void;
}

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
      <div className="rounded-md border">
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
    );
  }

  return (
    <div className="rounded-md border">
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
                onClick={() => onSort("namaLengkap")}
                className="flex items-center hover:text-foreground transition-colors font-semibold"
              >
                {TABLE_CONFIG.COLUMNS.NAMA.label}
                {renderSortIcon("namaLengkap")}
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
                onClick={() => onSort("tanggalMasuk")}
                className="flex items-center hover:text-foreground transition-colors font-semibold"
              >
                {TABLE_CONFIG.COLUMNS.TANGGAL.label}
                {renderSortIcon("tanggalMasuk")}
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
              <TableCell>{karyawan.namaLengkap}</TableCell>
              <TableCell>
                <Badge variant="secondary">{karyawan.departemenNama}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{karyawan.vendorNama}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {karyawan.noTelepon}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(karyawan.tanggalMasuk)}
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
  );
}
