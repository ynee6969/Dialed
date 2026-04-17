import { prisma } from "@/lib/prisma";

export async function listFavoritesByUserId(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      phone: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getFavoritePhoneIdsByUserId(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: {
      phoneId: true
    }
  });

  return favorites.map((favorite) => favorite.phoneId);
}

export async function addFavorite(userId: string, phoneId: string) {
  return prisma.favorite.upsert({
    where: {
      userId_phoneId: {
        userId,
        phoneId
      }
    },
    create: {
      userId,
      phoneId
    },
    update: {},
    include: {
      phone: true
    }
  });
}

export async function removeFavorite(userId: string, phoneId: string) {
  return prisma.favorite.deleteMany({
    where: {
      userId,
      phoneId
    }
  });
}
