import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data - proper order (child first, then parent)
  await prisma.karyawan.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.departemen.deleteMany();

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("✅ User created:", user);

  const departemens = [
    {
      namaDepartemen: "ADM Gen.Mgt",
      slugDepartemen: "adm-gen-mgt",
    },
    {
      namaDepartemen: "ADM HR",
      slugDepartemen: "adm-hr",
    },
    {
      namaDepartemen: "MFG Warehouse",
      slugDepartemen: "mfg-warehouse",
    },
    {
      namaDepartemen: "MFG Purchasing",
      slugDepartemen: "mfg-purchasing",
    },
    {
      namaDepartemen: "MFG Production",
      slugDepartemen: "mfg-production",
    },
    {
      namaDepartemen: "R&D QC/QA",
      slugDepartemen: "rnd-qc-qa",
    },
    {
      namaDepartemen: "MKT Sales&Distr",
      slugDepartemen: "mkt-sales-distr",
    },
    {
      namaDepartemen: "MFG Technical",
      slugDepartemen: "mfg-technical",
    },
    {
      namaDepartemen: "ADM Fin.& Acct.",
      slugDepartemen: "adm-fin-acct",
    },
    {
      namaDepartemen: "MFG PPIC",
      slugDepartemen: "mfg-ppic",
    },
    {
      namaDepartemen: "Outsourcing",
      slugDepartemen: "outsourcing",
    },
  ];

  const vendors = [
    {
      slugVendor: "pt-tropis-service",
      namaVendor: "PT. Tropis Service",
      alamat: "Jl. Industri No. 123, Jakarta Utara",
      noTelp: "021-12345678",
    },
    {
      slugVendor: "pt-garda-bhakti-nusantara",
      namaVendor: "PT. Garda Bhakti Nusantara",
      alamat: "Jl. Patriot No. 45, Bekasi",
      noTelp: "021-87654321",
    },
    {
      slugVendor: "cv-wafaiza-bati-bati",
      namaVendor: "CV. Wafaiza Bati-Bati",
      alamat: "Jl. Pantai No. 67, Bati-Bati",
      noTelp: "0512-345678",
    },
    {
      slugVendor: "pt-fadanara-berkah-bersama",
      namaVendor: "PT. Fadanara Berkah Bersama",
      alamat: "Jl. Syariah No. 89, Jakarta Selatan",
      noTelp: "021-98765432",
    },
  ];

  const vendor = await prisma.vendor.createMany({
    data: vendors,
    skipDuplicates: true,
  });
  console.log("✅ Vendors created:", vendor.count);

  const departemen = await prisma.departemen.createMany({
    data: departemens,
    skipDuplicates: true,
  });
  console.log("✅ Departemens created:", departemen.count);

  // Generate random karyawan data
  console.log("👥 Generating random karyawan...");

  const firstNames = [
    "Ahmad",
    "Budi",
    "Citra",
    "Dewi",
    "Eko",
    "Fitri",
    "Gunawan",
    "Hani",
    "Indra",
    "Joko",
    "Kartika",
    "Lisa",
    "Muhammad",
    "Nur",
    "Oka",
    "Putra",
    "Qori",
    "Rani",
    "Siti",
    "Tono",
    "Umar",
    "Vina",
    "Wati",
    "Yanto",
    "Zahra",
  ];

  const lastNames = [
    "Santoso",
    "Wijaya",
    "Kusuma",
    "Pratama",
    "Hidayat",
    "Saputra",
    "Lestari",
    "Permata",
    "Cahaya",
    "Wibowo",
    "Nugroho",
    "Setiawan",
    "Putra",
    "Putri",
    "Hartono",
    "Susanto",
    "Rahayu",
    "Marlina",
    "Firmansyah",
    "Purnomo",
  ];

  const streets = [
    "Jl. Merdeka",
    "Jl. Sudirman",
    "Jl. Thamrin",
    "Jl. Gatot Subroto",
    "Jl. Ahmad Yani",
    "Jl. Diponegoro",
    "Jl. Pahlawan",
    "Jl. Imam Bonjol",
    "Jl. Veteran",
    "Jl. Pemuda",
  ];

  const cities = [
    "Jakarta",
    "Bekasi",
    "Tangerang",
    "Depok",
    "Bogor",
    "Bandung",
    "Semarang",
    "Surabaya",
    "Yogyakarta",
    "Malang",
  ];

  // Get all vendors and departments
  const allVendors = await prisma.vendor.findMany();
  const allDepartments = await prisma.departemen.findMany();

  // Generate 50 random karyawan
  const karyawanData = [];
  const usedNIKs = new Set<string>();
  const usedPhones = new Set<string>();

  for (let i = 0; i < 500; i++) {
    // Generate unique NIK (16 digits)
    let nik: string;
    do {
      nik = String(
        Math.floor(1000000000000000 + Math.random() * 9000000000000000),
      );
    } while (usedNIKs.has(nik));
    usedNIKs.add(nik);

    // Generate unique phone number
    let noTelp: string;
    do {
      const prefix = ["0812", "0813", "0821", "0822", "0852", "0853"][
        Math.floor(Math.random() * 6)
      ];
      noTelp = prefix + String(Math.floor(10000000 + Math.random() * 90000000));
    } while (usedPhones.has(noTelp));
    usedPhones.add(noTelp);

    // Random name
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const NamaLengkap = `${firstName} ${lastName}`;

    // Random address
    const street = streets[Math.floor(Math.random() * streets.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const number = Math.floor(1 + Math.random() * 200);
    const alamat = `${street} No. ${number}, ${city}`;

    // Random date in the last 5 years
    const now = new Date();
    const fiveYearsAgo = new Date(
      now.getFullYear() - 5,
      now.getMonth(),
      now.getDate(),
    );
    const randomDate = new Date(
      fiveYearsAgo.getTime() +
        Math.random() * (now.getTime() - fiveYearsAgo.getTime()),
    );

    // Random vendor and department
    const randomVendor =
      allVendors[Math.floor(Math.random() * allVendors.length)];
    const randomDepartment =
      allDepartments[Math.floor(Math.random() * allDepartments.length)];

    karyawanData.push({
      nik,
      NamaLengkap,
      alamat,
      noTelp,
      tanggalMasukKaryawan: randomDate,
      vendorId: randomVendor.id,
      departemenId: randomDepartment.id,
    });
  }

  // Bulk insert karyawan
  const karyawan = await prisma.karyawan.createMany({
    data: karyawanData,
    skipDuplicates: true,
  });
  console.log("✅ Karyawan created:", karyawan.count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
