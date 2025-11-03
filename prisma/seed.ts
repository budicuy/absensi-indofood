import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await Promise.all([
    prisma.user.deleteMany(),
    prisma.vendor.deleteMany(),
    prisma.departemen.deleteMany(),
  ]);

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
