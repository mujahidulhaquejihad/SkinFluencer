import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@skinfluencer.bd";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log("Admin user already exists");
    return;
  }
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hash,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("Created admin user:", adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
