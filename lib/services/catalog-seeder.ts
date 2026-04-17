import { Prisma, type PrismaClient } from "@prisma/client";

import { seedPhones } from "@/lib/data/seed-phones";
import { prisma } from "@/lib/prisma";
import { deriveSeedScores } from "@/lib/services/scoring";
import { slugify } from "@/lib/utils/format";

export async function upsertSeedCatalog(client: PrismaClient = prisma) {
  for (const phone of seedPhones) {
    const slug = slugify(`${phone.brand}-${phone.model}`);
    const scores = deriveSeedScores(phone);

    await client.phone.upsert({
      where: { slug },
      update: {
        brand: phone.brand,
        model: phone.model,
        price: phone.price,
        segment: phone.segment,
        performanceScore: scores.performanceScore,
        cameraScore: scores.cameraScore,
        batteryScore: scores.batteryScore,
        valueScore: scores.valueScore,
        finalScore: scores.finalScore,
        battery: phone.battery,
        rawSeed: phone as unknown as Prisma.InputJsonValue
      },
      create: {
        slug,
        brand: phone.brand,
        model: phone.model,
        price: phone.price,
        segment: phone.segment,
        performanceScore: scores.performanceScore,
        cameraScore: scores.cameraScore,
        batteryScore: scores.batteryScore,
        valueScore: scores.valueScore,
        finalScore: scores.finalScore,
        battery: phone.battery,
        rawSeed: phone as unknown as Prisma.InputJsonValue
      }
    });
  }

  return seedPhones.length;
}
