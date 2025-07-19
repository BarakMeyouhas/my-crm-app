import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "123456", // אל תשכח להחליף בהשמטה אמיתית או bcrypt אם צריך
      role: "admin",
    },
  });

  console.log("✅ Seed complete:", { user });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
