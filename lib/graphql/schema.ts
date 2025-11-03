export const typeDefs = /* GraphQL */ `
  type Karyawan {
    id: String!
    nik: String!
    NamaLengkap: String!
    alamat: String!
    noTelp: String!
    tanggalMasukKaryawan: String!
    departemenId: String!
    vendorId: String!
    departemen: Departemen!
    vendor: Vendor!
    createdAt: String!
    updatedAt: String!
  }

  type Departemen {
    id: String!
    namaDepartemen: String!
    slugDepartemen: String!
  }

  type Vendor {
    id: String!
    namaVendor: String!
    slugVendor: String!
    alamat: String!
    noTelp: String!
  }

  input CreateKaryawanInput {
    nik: String!
    NamaLengkap: String!
    alamat: String!
    noTelp: String!
    tanggalMasukKaryawan: String!
    departemenId: String!
    vendorId: String!
  }

  input UpdateKaryawanInput {
    nik: String
    NamaLengkap: String
    alamat: String
    noTelp: String
    tanggalMasukKaryawan: String
    departemenId: String
    vendorId: String
  }

  type Query {
    karyawan(id: String!): Karyawan
    karyawans: [Karyawan!]!
    departemens: [Departemen!]!
    vendors: [Vendor!]!
  }

  type Mutation {
    createKaryawan(input: CreateKaryawanInput!): Karyawan!
    updateKaryawan(id: String!, input: UpdateKaryawanInput!): Karyawan!
    deleteKaryawan(id: String!): Karyawan!
  }
`;
