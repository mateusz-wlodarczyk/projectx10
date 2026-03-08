#!/usr/bin/env node
/**
 * Zmienia w CSV availability wszystkie daty w JSON z 2025 na 2026
 * (żeby boat_availability_2026.csv pokazywał dostępność na rok 2026).
 * Użycie: node scripts/shift-availability-year.js [input.csv] [output.csv]
 * Domyślnie: boat_availability_2026.csv -> nadpisuje (backup nie jest robiony).
 */

const fs = require("fs");
const path = require("path");

const defaultDir = path.join(__dirname, "supabase_csv");
const inputPath = process.argv[2] || path.join(defaultDir, "boat_availability_2026.csv");
const outputPath = process.argv[3] || inputPath;

const fromYear = process.argv[4] || "2025";
const toYear = process.argv[5] || "2026";

const content = fs.readFileSync(inputPath, "utf8");

// Zamiana tylko dat ISO (np. 2025-04-10T... lub "2025-05-02") na rok docelowy
const shifted = content
  .replace(new RegExp(fromYear + "-(\\d{2}-\\d{2}T)", "g"), toYear + "-$1")
  .replace(new RegExp(fromYear + "-(\\d{2}-\\d{2})", "g"), toYear + "-$1");

fs.writeFileSync(outputPath, shifted, "utf8");
console.log("Zamieniono " + fromYear + " -> " + toYear + " w " + outputPath);
