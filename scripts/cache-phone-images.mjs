import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient, SourceKind } from "@prisma/client";

const prisma = new PrismaClient();

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, "..");
const outputDirectory = path.join(workspaceRoot, "public", "phone-images");
const manifestPath = path.join(workspaceRoot, "lib", "data", "phone-image-manifest.json");
const GSM_ARENA_BASE = "https://www.gsmarena.com/";

function normalizeUrl(url, sourceUrl) {
  if (!url) {
    return null;
  }

  try {
    return new URL(url, sourceUrl ?? GSM_ARENA_BASE).toString();
  } catch {
    return null;
  }
}

function resolveExtension(contentType, imageUrl) {
  if (contentType?.includes("png")) {
    return "png";
  }

  if (contentType?.includes("webp")) {
    return "webp";
  }

  if (contentType?.includes("gif")) {
    return "gif";
  }

  try {
    const pathname = new URL(imageUrl).pathname.toLowerCase();
    const match = pathname.match(/\.(jpg|jpeg|png|webp|gif)$/);
    if (match) {
      return match[1] === "jpeg" ? "jpg" : match[1];
    }
  } catch {
    return "jpg";
  }

  return "jpg";
}

async function readManifest() {
  try {
    const content = await readFile(manifestPath, "utf8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function downloadPhoneImage(phone, manifest) {
  const source = phone.sources[0];
  const extraction =
    source?.rawExtraction && typeof source.rawExtraction === "object" && !Array.isArray(source.rawExtraction)
      ? source.rawExtraction
      : null;
  const remoteImageUrl =
    extraction && typeof extraction.imageUrl === "string" ? extraction.imageUrl : null;
  const resolvedImageUrl = normalizeUrl(remoteImageUrl, source?.sourceUrl);

  if (!resolvedImageUrl) {
    return false;
  }

  const response = await fetch(resolvedImageUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      referer: source?.sourceUrl ?? GSM_ARENA_BASE
    }
  });

  if (!response.ok) {
    throw new Error(`Image request failed with ${response.status}`);
  }

  const extension = resolveExtension(response.headers.get("content-type"), resolvedImageUrl);
  const relativePath = `/phone-images/${phone.slug}.${extension}`;
  const absolutePath = path.join(outputDirectory, `${phone.slug}.${extension}`);
  const bytes = Buffer.from(await response.arrayBuffer());

  await writeFile(absolutePath, bytes);
  manifest[phone.slug] = relativePath;
  return true;
}

async function main() {
  await mkdir(outputDirectory, { recursive: true });

  const manifest = await readManifest();
  const phones = await prisma.phone.findMany({
    select: {
      slug: true,
      sources: {
        where: {
          sourceKind: SourceKind.gsmarena
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: 1,
        select: {
          sourceUrl: true,
          rawExtraction: true
        }
      }
    }
  });

  let successCount = 0;

  for (const phone of phones) {
    try {
      const downloaded = await downloadPhoneImage(phone, manifest);
      if (downloaded) {
        successCount += 1;
        console.log(`[phone-image] cached ${phone.slug}`);
      } else {
        console.log(`[phone-image] skipped ${phone.slug} (no remote image)`);
      }
    } catch (error) {
      console.error(`[phone-image] failed ${phone.slug}:`, error instanceof Error ? error.message : error);
    }
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`[phone-image] completed. Cached ${successCount} images.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
