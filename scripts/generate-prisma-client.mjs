import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function resolveSchemaPath() {
  const url = process.env.DATABASE_URL?.trim() ?? "";

  if (url.startsWith("file:")) {
    return "prisma/schema.sqlite.prisma";
  }

  return "prisma/schema.prisma";
}

const schemaPath = resolveSchemaPath();
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const prismaBin = process.platform === "win32"
  ? path.join(projectRoot, "node_modules", ".bin", "prisma.cmd")
  : path.join(projectRoot, "node_modules", ".bin", "prisma");
const prismaArgs = ["generate", "--schema", schemaPath];
const generatedClientPath = path.join(projectRoot, "node_modules", ".prisma", "client", "index.d.ts");
const command = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : prismaBin;
const commandArgs = process.platform === "win32"
  ? ["/d", "/s", "/c", `"${prismaBin}" ${prismaArgs.join(" ")}`]
  : prismaArgs;

const result = spawnSync(command, commandArgs, {
  stdio: "pipe",
  cwd: projectRoot,
  env: process.env
});

const stdout = result.stdout?.toString() ?? "";
const stderr = result.stderr?.toString() ?? "";

if (stdout) {
  process.stdout.write(stdout);
}

if (stderr) {
  process.stderr.write(stderr);
}

if (result.status !== 0) {
  const combinedOutput = `${stdout}\n${stderr}`;

  if (combinedOutput.includes("EPERM: operation not permitted, unlink") && existsSync(generatedClientPath)) {
    process.stderr.write(
      "\n[generate-prisma-client] Prisma client already exists and the local files are locked. Continuing.\n"
    );
    process.exit(0);
  }

  if (result.error) {
    process.stderr.write(`\n[generate-prisma-client] ${result.error.message}\n`);
  }

  process.exit(result.status ?? 1);
}
