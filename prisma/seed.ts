import { prisma } from "@/lib/prisma";
import { upsertSeedCatalog } from "@/lib/services/catalog-seeder";

async function main() {
  await upsertSeedCatalog(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
