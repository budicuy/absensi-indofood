import * as dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env file sebelum access env variables
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
