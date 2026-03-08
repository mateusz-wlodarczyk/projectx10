#!/usr/bin/env node
/**
 * Parses PostgreSQL cluster dump (.backup from pg_dump) and exports each COPY
 * table to a separate CSV file for Supabase import.
 * Usage: node scripts/backup-to-csv.js [path-to.backup]
 * Default backup path: ../db_cluster-10-10-2025@23-40-35 copy.backup (from repo root)
 */

const fs = require("fs");
const path = require("path");

const backupPath =
  process.argv[2] ||
  path.join(__dirname, "..", "db_cluster-10-10-2025@23-40-35 copy.backup");
const outDir = path.join(__dirname, "supabase_csv");

const COPY_RE = /^COPY\s+(?:([a-z_]+)\.)?([a-z0-9_]+)\s*\(([^)]+)\)\s+FROM\s+stdin;?\s*$/i;

function escapeCsv(val) {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function parseCopyLine(line) {
  const m = line.match(COPY_RE);
  if (!m) return null;
  const schema = m[1] || "public";
  const table = m[2];
  const cols = m[3].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
  return { schema, table, cols };
}

function main() {
  if (!fs.existsSync(backupPath)) {
    console.error("Backup file not found:", backupPath);
    process.exit(1);
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const content = fs.readFileSync(backupPath, "utf8");
  const lines = content.split(/\r?\n/);

  let current = null;
  let rows = [];
  let tableCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === "\\.") {
      if (current && current.cols) {
        const name = current.schema === "public" ? current.table : `${current.schema}_${current.table}`;
        const csvPath = path.join(outDir, `${name}.csv`);
        const header = current.cols.map(escapeCsv).join(",");
        const body = rows
          .map((row) => {
            const cells = row.split("\t").map((cell) => {
              const v = cell === "\\N" ? "" : cell.replace(/\\t/g, "\t").replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
              return escapeCsv(v);
            });
            return cells.join(",");
          })
          .join("\n");
        fs.writeFileSync(csvPath, header + "\n" + body, "utf8");
        console.log(`Written ${rows.length} rows -> ${name}.csv`);
        tableCount++;
      }
      current = null;
      rows = [];
      continue;
    }

    const copyInfo = parseCopyLine(line);
    if (copyInfo) {
      current = copyInfo;
      rows = [];
      continue;
    }

    if (current && current.cols && line.length > 0) {
      rows.push(line);
    }
  }

  console.log(`Done. ${tableCount} tables -> ${outDir}`);
}

main();
