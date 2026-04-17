from pathlib import Path
import sqlite3


SCHEMA_SQL = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "Phone" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "segment" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "performanceScore" REAL,
  "cameraScore" REAL,
  "batteryScore" REAL,
  "valueScore" REAL,
  "finalScore" REAL,
  "display" TEXT,
  "chipset" TEXT,
  "gpu" TEXT,
  "ram" INTEGER,
  "storage" INTEGER,
  "cameraMain" INTEGER,
  "cameraUltrawide" INTEGER,
  "battery" INTEGER,
  "charging" INTEGER,
  "os" TEXT,
  "releaseYear" INTEGER,
  "releaseDate" DATETIME,
  "benchmarkScore" INTEGER,
  "aiSummary" TEXT,
  "enrichmentStatus" TEXT NOT NULL DEFAULT 'pending',
  "enrichmentConfidence" REAL,
  "preferredSource" TEXT,
  "lastEnrichedAt" DATETIME,
  "rawSeed" TEXT NOT NULL,
  "enrichmentPayload" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "Phone_slug_key" ON "Phone"("slug");
CREATE INDEX IF NOT EXISTS "Phone_segment_price_idx" ON "Phone"("segment", "price");
CREATE INDEX IF NOT EXISTS "Phone_brand_model_idx" ON "Phone"("brand", "model");
CREATE INDEX IF NOT EXISTS "Phone_finalScore_idx" ON "Phone"("finalScore");

CREATE TABLE IF NOT EXISTS "PhoneSource" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "phoneId" TEXT NOT NULL,
  "sourceKind" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "cacheKey" TEXT NOT NULL,
  "rawMarkdown" TEXT,
  "rawExtraction" TEXT,
  "fetchedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PhoneSource_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "Phone" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PhoneSource_cacheKey_key" ON "PhoneSource"("cacheKey");
CREATE INDEX IF NOT EXISTS "PhoneSource_phoneId_sourceKind_idx" ON "PhoneSource"("phoneId", "sourceKind");

CREATE TABLE IF NOT EXISTS "EnrichmentJob" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "phoneId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'queued',
  "provider" TEXT,
  "sourceKind" TEXT,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "error" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" DATETIME,
  "finishedAt" DATETIME,
  CONSTRAINT "EnrichmentJob_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "Phone" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "EnrichmentJob_status_createdAt_idx" ON "EnrichmentJob"("status", "createdAt");
"""


def initialize_database(db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(db_path)
    try:
      connection.executescript(SCHEMA_SQL)
      connection.commit()
    finally:
      connection.close()


def main() -> None:
    database_paths = [Path("dev.db"), Path("prisma/dev.db")]
    for path in database_paths:
        initialize_database(path)
        print(f"initialized {path}")


if __name__ == "__main__":
    main()
