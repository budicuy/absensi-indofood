# CRUD Karyawan - Best Practice

Implementasi CRUD untuk data Karyawan menggunakan Next.js 16, Prisma, GraphQL Yoga, dan Zod.

## 🏗️ Arsitektur

```
app/
├── api/graphql/route.ts          # GraphQL API endpoint
├── dashboard/
│   └── master-data/
│       └── karyawan/
│           └── page.tsx           # Halaman CRUD Karyawan
components/
└── karyawan-form.tsx             # Modal form dengan validasi
lib/
├── graphql/
│   ├── schema.ts                 # GraphQL Schema (TypeDefs)
│   ├── resolvers.ts              # GraphQL Resolvers
│   ├── client.ts                 # GraphQL Client
│   └── types.ts                  # TypeScript Types
└── validations/
    └── karyawan.ts               # Zod Schema untuk validasi
```

## 🚀 Fitur

### ✅ Best Practices Implemented

1. **Type Safety Penuh**
   - Auto-generated types dari Prisma
   - Zod validation schema
   - TypeScript interfaces untuk GraphQL

2. **Single Page Application**
   - Modal untuk form (create & update)
   - Tidak ada page reload
   - Optimistic UI updates

3. **Clean Code**
   - Separation of concerns
   - Reusable components
   - Minimal boilerplate

4. **Error Handling**
   - Validasi di client (Zod)
   - Validasi di server (GraphQL)
   - User-friendly error messages
   - Toast notifications

5. **Performance**
   - Single GraphQL query untuk fetch semua data
   - Efficient re-fetching
   - Optimized imports

## 📝 GraphQL Operations

### Queries

```graphql
# Get all karyawan with relations
query {
  karyawans {
    id
    nik
    NamaLengkap
    alamat
    noTelp
    tanggalMasukKaryawan
    departemen { namaDepartemen }
    vendor { namaVendor }
    gajiPokok { jumlahGaji }
  }
}

# Get single karyawan
query {
  karyawan(id: "xxx") {
    id
    nik
    NamaLengkap
    # ...
  }
}

# Get master data
query {
  departemens { id namaDepartemen }
  vendors { id namaVendor }
  gajiPokoks { id jumlahGaji }
}
```

### Mutations

```graphql
# Create karyawan
mutation {
  createKaryawan(input: {
    nik: "123456"
    NamaLengkap: "John Doe"
    alamat: "Jakarta"
    noTelp: "08123456789"
    tanggalMasukKaryawan: "2025-01-01"
    departemenId: "xxx"
    vendorId: "xxx"
    gajiPokokId: "xxx"
  }) {
    id
    nik
    NamaLengkap
  }
}

# Update karyawan
mutation {
  updateKaryawan(id: "xxx", input: {
    NamaLengkap: "Jane Doe"
    # fields yang ingin diupdate
  }) {
    id
    NamaLengkap
  }
}

# Delete karyawan
mutation {
  deleteKaryawan(id: "xxx") {
    id
  }
}
```

## 🔧 Cara Penggunaan

### 1. Akses Halaman
```
http://localhost:3000/dashboard/master-data/karyawan
```

### 2. Tambah Karyawan
- Klik tombol "Tambah Karyawan"
- Isi form yang muncul
- Klik "Simpan"

### 3. Edit Karyawan
- Klik icon pensil pada baris karyawan
- Edit data di form
- Klik "Simpan"

### 4. Hapus Karyawan
- Klik icon trash pada baris karyawan
- Konfirmasi penghapusan
- Data akan terhapus

## 🛠️ Teknologi

- **Next.js 16** - React framework dengan App Router
- **Prisma** - ORM dengan type safety
- **GraphQL Yoga** - Lightweight GraphQL server
- **Zod** - Schema validation
- **Shadcn UI** - Komponen UI
- **React Hot Toast** - Notifikasi

## 📦 Validasi

### Client-side (Zod)
```typescript
const karyawanSchema = z.object({
  nik: z.string().min(1, "NIK wajib diisi"),
  NamaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  noTelp: z.string().min(1, "Nomor telepon wajib diisi"),
  tanggalMasukKaryawan: z.string().min(1, "Tanggal masuk wajib diisi"),
  departemenId: z.string().min(1, "Departemen wajib dipilih"),
  vendorId: z.string().min(1, "Vendor wajib dipilih"),
  gajiPokokId: z.string().min(1, "Gaji pokok wajib dipilih"),
});
```

### Server-side (GraphQL Resolvers)
- Validasi NIK unique
- Validasi No Telp unique
- Validasi foreign keys
- Error handling with GraphQLError

## 🎯 Keuntungan Implementasi Ini

### 1. **Maintenance**
- Kode singkat dan mudah dipahami
- Single source of truth (GraphQL schema)
- Type safety dari Prisma ke frontend

### 2. **Scalability**
- Mudah menambah field baru
- Mudah menambah validasi
- Reusable components

### 3. **Developer Experience**
- Auto-complete di editor
- Type checking
- Clear error messages

### 4. **User Experience**
- Fast feedback
- No page reload
- Clear validation messages
- Responsive UI

## 🔄 Cara Menambah Field Baru

1. Update schema Prisma
2. Run `prisma generate`
3. Update GraphQL schema (`lib/graphql/schema.ts`)
4. Update resolver (`lib/graphql/resolvers.ts`)
5. Update Zod schema (`lib/validations/karyawan.ts`)
6. Update form component (`components/karyawan-form.tsx`)
7. Update table di page (`app/dashboard/master-data/karyawan/page.tsx`)

## 📊 API Endpoint

- **GraphQL**: `/api/graphql`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Test dengan curl:
```bash
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ karyawans { id nik NamaLengkap } }"}'
```

## 🧪 Testing GraphQL

Akses GraphQL Playground:
```
http://localhost:3000/api/graphql
```

GraphQL Yoga menyediakan GraphiQL interface untuk testing queries dan mutations.

## 📝 Notes

- Semua operasi CRUD menggunakan GraphQL
- Validasi dilakukan di 2 layer (client & server)
- Form menggunakan controlled components
- State management dengan React hooks
- Error handling comprehensive
- Toast notifications untuk feedback
