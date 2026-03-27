import { spawnSync } from "node:child_process";

// Temporary allowlist for upstream advisories in Prisma toolchain packages.
// Remove entries as soon as upstream patches are available.
const ALLOWED_GHSA = new Set([
  "GHSA-wc8c-qw6v-h7f6",
  "GHSA-38f7-945m-qr2g",
  "GHSA-9r54-q6cx-xmh5",
  "GHSA-6wqw-2p9w-4vw4",
  "GHSA-r354-f388-2fhh",
  "GHSA-w332-q679-j88p",
  "GHSA-gq3j-xvxp-8hrf",
  "GHSA-5pq2-9x2x-5p6w",
  "GHSA-p6xx-57qc-3wxr",
  "GHSA-q5qw-h33p-qvwr",
  "GHSA-v8w9-8mx6-g223",
]);

const result = spawnSync("npm", ["audit", "--json"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});

const raw = result.stdout?.trim() || "{}";
let report;

try {
  report = JSON.parse(raw);
} catch {
  console.error("Unable to parse npm audit JSON output.");
  process.exit(2);
}

const findings = [];
const vulnerabilities = report.vulnerabilities || {};

for (const [pkg, details] of Object.entries(vulnerabilities)) {
  const via = Array.isArray(details.via) ? details.via : [];

  for (const entry of via) {
    if (!entry || typeof entry === "string") continue;

    const severity = (entry.severity || "").toLowerCase();
    if (severity !== "high" && severity !== "critical") continue;

    const url = entry.url || "";
    const ghsaMatch = url.match(/GHSA-[a-z0-9-]+/i);
    const ghsa = ghsaMatch ? ghsaMatch[0] : "UNKNOWN";

    findings.push({
      package: pkg,
      severity,
      ghsa,
      title: entry.title || "(no title)",
      url,
    });
  }
}

if (findings.length === 0) {
  console.log("audit-gate: no high/critical vulnerabilities found.");
  process.exit(0);
}

const unallowed = findings.filter((f) => !ALLOWED_GHSA.has(f.ghsa));

if (unallowed.length === 0) {
  console.log("audit-gate: only allowlisted high/critical advisories detected.");
  console.log("Allowlisted advisories:");
  for (const finding of findings) {
    console.log(`- ${finding.ghsa} | ${finding.package} | ${finding.title}`);
  }
  process.exit(0);
}

console.error("audit-gate: blocking due to non-allowlisted high/critical advisories.");
for (const finding of unallowed) {
  console.error(`- ${finding.ghsa} | ${finding.package} | ${finding.title} | ${finding.url}`);
}

process.exit(1);
