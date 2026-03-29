import { spawnSync } from "node:child_process";

// Temporary allowlist for upstream advisories in Prisma toolchain packages.
// Remove entries as soon as upstream patches are available.
//
// ⚠️  IMPORTANT EXPIRATION NOTICE ⚠️
// All entries expire on: 2026-06-30
// When this date passes, CI will fail. At that point:
// 1. Review each GHSA to see if upstream patches are available
// 2. Remove entries that have been patched
// 3. For remaining issues, update expiry with explicit justification
// 4. Consider pinning or replacing packages if patches are delayed
//
// Set a calendar reminder for 2026-06-25 to review this allowlist!
const ALLOWLIST_EXPIRES_ON = "2026-06-30";

const ALLOWED_ADVISORIES = [
  {
    ghsa: "GHSA-wc8c-qw6v-h7f6",
    package: "@hono/node-server",
    reason: "Transitive through Prisma CLI toolchain.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
  {
    ghsa: "GHSA-38f7-945m-qr2g",
    package: "effect",
    reason: "Transitive through Prisma config tooling.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
  {
    ghsa: "GHSA-9r54-q6cx-xmh5",
    package: "hono",
    reason: "Transitive through Prisma dev dependency graph.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
  {
    ghsa: "GHSA-6wqw-2p9w-4vw4",
    package: "hono",
    reason: "Transitive through Prisma dev dependency graph.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
  {
    ghsa: "GHSA-r354-f388-2fhh",
    package: "hono",
    reason: "Transitive through Prisma dev dependency graph.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
  {
    ghsa: "GHSA-w332-q679-j88p",
    package: "hono",
    reason: "Transitive through Prisma dev dependency graph.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
  {
    ghsa: "GHSA-gq3j-xvxp-8hrf",
    package: "hono",
    reason: "Transitive through Prisma dev dependency graph.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
  {
    ghsa: "GHSA-5pq2-9x2x-5p6w",
    package: "hono",
    reason: "Transitive through Prisma dev dependency graph.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
  {
    ghsa: "GHSA-p6xx-57qc-3wxr",
    package: "hono",
    reason: "Transitive through Prisma dev dependency graph.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
  {
    ghsa: "GHSA-q5qw-h33p-qvwr",
    package: "hono",
    reason: "Transitive through Prisma dev dependency graph.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
  {
    ghsa: "GHSA-v8w9-8mx6-g223",
    package: "hono",
    reason: "Transitive through Prisma dev dependency graph.",
    expiresOn: ALLOWLIST_EXPIRES_ON,
  },
];

function parseDateOnly(input) {
  const date = new Date(`${input}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isAllowlisted(finding) {
  return ALLOWED_ADVISORIES.some((entry) => {
    if (entry.ghsa !== finding.ghsa) return false;

    const expiresAt = parseDateOnly(entry.expiresOn);
    if (!expiresAt) return false;

    const now = new Date();
    if (now > expiresAt) return false;

    return entry.package === finding.package;
  });
}

function getExpiredAllowlistEntries() {
  const now = new Date();
  return ALLOWED_ADVISORIES.filter((entry) => {
    const expiresAt = parseDateOnly(entry.expiresOn);
    if (!expiresAt) return true;
    return now > expiresAt;
  });
}

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

const expiredAllowlist = getExpiredAllowlistEntries();
if (expiredAllowlist.length > 0) {
  console.error("audit-gate: allowlist contains expired entries.");
  for (const entry of expiredAllowlist) {
    console.error(`- ${entry.ghsa} | ${entry.package} | expired: ${entry.expiresOn}`);
  }
  process.exit(1);
}

const unallowed = findings.filter((f) => !isAllowlisted(f));

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
