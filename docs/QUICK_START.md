# 🚀 Quick Start - CRUD Karyawan

## Akses Langsung

1. **Buka browser**: http://localhost:3001
2. **Login** dengan akun Anda
3. **Navigate**: Sidebar → Master Data → Data Karyawan

## Interface

### Tampilan Utama
```
┌─────────────────────────────────────────────────┐
│ Data Karyawan              [+ Tambah Karyawan]  │
├─────────────────────────────────────────────────┤
│ Kelola data karyawan Indofood                   │
├─────────────────────────────────────────────────┤
│                                                 │
│ Daftar Karyawan                                 │
│ Total X karyawan terdaftar                      │
│                                                 │
│ ┌───────────────────────────────────────────┐   │
│ │ NIK | Nama | Dept | Vendor | ... | Aksi  │   │
│ ├───────────────────────────────────────────┤   │
│ │ ... | .... | .... | ...... | ... | ✏️ 🗑️ │   │
│ └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## CRUD Operations

### ➕ CREATE (Tambah)
1. Klik **"+ Tambah Karyawan"**
2. Modal form akan muncul
3. Isi semua field:
   - NIK (required, unique)
   - Nama Lengkap (required)
   - Alamat (required)
   - No Telepon (required, unique)
   - Tanggal Masuk (required)
   - Departemen (dropdown)
   - Vendor (dropdown)
   - Gaji Pokok (dropdown)
4. Klik **"Simpan"**
5. ✅ Toast notification: "Karyawan berhasil ditambahkan"

### 📖 READ (Lihat)
- Data otomatis dimuat saat page load
- Refresh otomatis setelah create/update/delete
- Tampilan dalam table dengan 8 kolom

### ✏️ UPDATE (Edit)
1. Klik icon **pensil (✏️)** pada row yang ingin diedit
2. Modal form akan muncul dengan data terisi
3. Edit field yang diperlukan
4. Klik **"Simpan"**
5. ✅ Toast notification: "Karyawan berhasil diupdate"

### 🗑️ DELETE (Hapus)
1. Klik icon **trash (🗑️)** pada row yang ingin dihapus
2. Dialog konfirmasi akan muncul
3. Klik **"Hapus"** untuk konfirmasi
4. ✅ Toast notification: "Karyawan berhasil dihapus"

## Validasi

### Client-side (Real-time)
- ❌ NIK kosong → "NIK wajib diisi"
- ❌ Nama kosong → "Nama lengkap wajib diisi"
- ❌ No Telp kosong → "Nomor telepon wajib diisi"
- ❌ Field tidak dipilih → "XXX wajib dipilih"

### Server-side (GraphQL)
- ❌ NIK duplikat → "NIK sudah terdaftar"
- ❌ No Telp duplikat → "Nomor telepon sudah terdaftar"
- ❌ Foreign key invalid → Error message

## Keyboard Shortcuts

- `Esc` - Tutup modal/dialog
- `Enter` - Submit form (saat di modal)

## Tips

### 💡 Best Practices
1. **Unique Fields**: NIK dan No Telp harus unique
2. **Format Tanggal**: Otomatis diformat ke locale Indonesia
3. **Currency**: Gaji otomatis format Rupiah
4. **Validation**: Semua field required divalidasi

### ⚡ Performance
- Data di-cache di state
- Re-fetch hanya setelah mutation
- Loading state saat fetch data

### 🎨 UI/UX
- Modal untuk form (no page reload)
- Confirmation dialog untuk delete
- Toast untuk semua feedback
- Loading indicator saat submit

## Contoh Data

```json
{
  "nik": "IDF001",
  "NamaLengkap": "Budi Santoso",
  "alamat": "Jl. Sudirman No. 123, Jakarta Selatan",
  "noTelp": "081234567890",
  "tanggalMasukKaryawan": "2025-01-15",
  "departemenId": "dept-001",
  "vendorId": "vendor-001",
  "gajiPokokId": "gaji-001"
}
```

## Troubleshooting

### Form tidak bisa submit
- ✅ Pastikan semua field required terisi
- ✅ Cek console browser untuk error detail

### Data tidak muncul
- ✅ Refresh page
- ✅ Cek console untuk GraphQL errors
- ✅ Pastikan database ada data

### Modal tidak muncul
- ✅ Clear browser cache
- ✅ Hard reload (Ctrl + Shift + R)

## GraphQL Playground

Untuk testing manual GraphQL:
- URL: http://localhost:3001/api/graphql
- Interface: GraphiQL (built-in)

Example query:
```graphql
{
  karyawans {
    id
    nik
    NamaLengkap
    departemen {
      namaDepartemen
    }
  }
}
```

---

**Have fun! 🎉**
