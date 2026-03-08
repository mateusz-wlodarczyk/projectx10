#!/usr/bin/env node
/**
 * Uzupełnia puste pola w boats_list.csv wartościami domyślnymi dla kolumn NOT NULL,
 * żeby import do Supabase nie rzucał 23502 (null constraint).
 * Nadpisuje plik.
 */

const fs = require("fs");
const path = require("path");

const csvPath = process.argv[2] || path.join(__dirname, "supabase_csv", "boats_list.csv");

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (!inQuotes && c === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

function escapeCsv(val) {
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const content = fs.readFileSync(csvPath, "utf8");
const lines = content.split(/\r?\n/);
const header = lines[0];
const columnNames = parseCsvLine(header);

// Kolumny NOT NULL w boats_list, które mogą być puste w CSV -> wartość domyślna
const notNullDefaults = {
  captain: "",
  lastCustomer: "",
  additional_specials: "{}",
  featuredUsp: "{}",
  freeBerths: "{}",
  charter: "{}",
  charter_id: "",
  parameters: "{}",
  charter_rank: "{}",
  usp: "{}",
};

const indicesToFix = new Map();
for (const [name, defaultVal] of Object.entries(notNullDefaults)) {
  const i = columnNames.indexOf(name);
  if (i !== -1) indicesToFix.set(i, defaultVal);
}

const outLines = [header];
for (let r = 1; r < lines.length; r++) {
  const line = lines[r];
  if (!line.trim()) {
    outLines.push(line);
    continue;
  }
  const fields = parseCsvLine(line);
  for (const [idx, defaultVal] of indicesToFix) {
    const raw = fields[idx];
    const trimmed = raw ? raw.trim() : "";
    if (trimmed === "" || trimmed === '""') {
      fields[idx] = defaultVal === "{}" ? "{}" : defaultVal;
    }
  }
  outLines.push(fields.map(escapeCsv).join(","));
}

fs.writeFileSync(csvPath, outLines.join("\n"), "utf8");
console.log("Zaktualizowano " + csvPath + " (uzupełniono puste NOT NULL)");
console.log("Kolumny:", Array.from(indicesToFix.keys()).map((i) => columnNames[i]).join(", "));
console.log("Wierszy:", outLines.length - 1);
console.log("Zapisano.");
process.exit(0);
