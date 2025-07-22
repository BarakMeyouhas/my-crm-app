const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const companies = [
    { name: "TechNova", contactEmail: "info@technova.com", subscriptionPlan: "Basic" },
    { name: "GreenEdge Solutions", contactEmail: "info@greenedge.com", subscriptionPlan: "Basic" },
    { name: "ByteBridge", contactEmail: "info@bytebridge.com", subscriptionPlan: "Basic" },
    { name: "OmegaHealth", contactEmail: "info@omegahealth.com", subscriptionPlan: "Basic" },
    { name: "Cloudify", contactEmail: "info@cloudify.com", subscriptionPlan: "Basic" },
    { name: "SecureStack", contactEmail: "info@securestack.com", subscriptionPlan: "Basic" },
    { name: "DataSpring", contactEmail: "info@dataspring.com", subscriptionPlan: "Basic" },
    { name: "NextGen AI", contactEmail: "info@nextgenai.com", subscriptionPlan: "Basic" },
  ];

  for (const company of companies) {
    await prisma.company.create({ data: company });
  }
  console.log("Companies seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
