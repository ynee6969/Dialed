import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { queueStalePhonesForEnrichment } from "@/lib/pipeline/enrichment";
import { upsertSeedCatalog } from "@/lib/services/catalog-seeder";
import {
  getErrorMessage,
  hasDatabaseUrl,
  isPrismaRuntimeError,
  logServerFailure
} from "@/lib/services/runtime-safety";

export interface BootstrapStatus {
  seeded: number;
  queued: number;
  skipped: boolean;
  degraded?: boolean;
  reason?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var bootstrapPromise: Promise<BootstrapStatus> | undefined;
}

export async function ensureApplicationBootstrapped(): Promise<BootstrapStatus> {
  if (env.BOOTSTRAP_ON_STARTUP !== "true") {
    return {
      seeded: 0,
      queued: 0,
      skipped: true,
      reason: "Bootstrap is disabled."
    };
  }

  if (!hasDatabaseUrl()) {
    return {
      seeded: 0,
      queued: 0,
      skipped: true,
      reason: "DATABASE_URL is not configured."
    };
  }

  if (!global.bootstrapPromise) {
    global.bootstrapPromise = (async () => {
      try {
        const count = await prisma.phone.count();
        const seeded = count === 0 ? await upsertSeedCatalog() : 0;

        try {
          const queued = await queueStalePhonesForEnrichment();

          return {
            seeded,
            queued,
            skipped: false
          };
        } catch (error) {
          logServerFailure("bootstrap.queue", error);

          return {
            seeded,
            queued: 0,
            skipped: false,
            degraded: true,
            reason: getErrorMessage(error, "Catalog loaded, but enrichment queueing failed.")
          };
        }
      } catch (error) {
        logServerFailure("bootstrap.init", error);

        return {
          seeded: 0,
          queued: 0,
          skipped: true,
          reason: isPrismaRuntimeError(error)
            ? "Database is unavailable or not migrated."
            : getErrorMessage(error, "Bootstrap failed.")
        };
      }
    })();
  }

  return global.bootstrapPromise;
}
