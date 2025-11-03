import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
    },
  });

  console.log("✅ User created:", user);
  console.log("📝 Login credentials:");
  console.log("   Username: admin");
  console.log("   Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
