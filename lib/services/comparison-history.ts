import { prisma } from "@/lib/prisma";

export async function rememberComparisonSnapshot(
  userId: string,
  leftPhoneId: string,
  rightPhoneId: string
) {
  return prisma.comparisonSnapshot.upsert({
    where: {
      userId_leftPhoneId_rightPhoneId: {
        userId,
        leftPhoneId,
        rightPhoneId
      }
    },
    create: {
      userId,
      leftPhoneId,
      rightPhoneId
    },
    update: {
      updatedAt: new Date()
    }
  });
}

export async function listRecentComparisonSnapshotsByUserId(userId: string, take = 6) {
  return prisma.comparisonSnapshot.findMany({
    where: { userId },
    include: {
      leftPhone: {
        select: {
          id: true,
          slug: true,
          brand: true,
          model: true
        }
      },
      rightPhone: {
        select: {
          id: true,
          slug: true,
          brand: true,
          model: true
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    },
    take
  });
}
