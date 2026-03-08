# CSV wyeksportowane z pg_dump (backup Supabase)

## 1. Utwórz tabele w Supabase

W **Supabase** → **SQL Editor** → **New query** wklej zawartość pliku **`create_tables.sql`** i uruchom (Run). Skrypt tworzy tabele: `boats_list`, `boat_availability_2025`, `boat_availability_2026`, `boat_availability_2027`, `example` oraz podstawowe polityki RLS (odczyt dla wszystkich).

## 2. (Opcjonalnie) Kolumna `usp` – jeśli tabela już istnieje i import rzuca 23502

Jeśli przy imporcie `boats_list.csv` pojawia się błąd **null value in column "usp"**, w **SQL Editor** uruchom:

```sql
ALTER TABLE public.boats_list ALTER COLUMN usp DROP NOT NULL;
ALTER TABLE public.boats_list ALTER COLUMN usp SET DEFAULT '{}';
```

Po tym import CSV powinien przejść (puste `usp` będą traktowane jako NULL, a domyślnie nowe wiersze dostaną `'{}'`).

## 3. Import CSV

Każdy plik CSV = jedna tabela. **Table Editor** → wybierz tabelę → **Import data from CSV** i wybierz odpowiedni plik z tego folderu. Kolejność importu: najpierw **boats_list**, potem **boat_availability_2025**, **boat_availability_2026**, **boat_availability_2027** (ze względu na klucze obce).

## Tabele `public` (dla aplikacji boatsStats)

| Plik | Tabela w Supabase | Wierszy |
|------|-------------------|--------|
| `boats_list.csv` | `public.boats_list` | 1021 |
| `boat_availability_2025.csv` | `public.boat_availability_2025` | 942 |
| `boat_availability_2026.csv` | `public.boat_availability_2026` | 534 |
| `boat_availability_2027.csv` | `public.boat_availability_2027` | 0 |
| `example.csv` | `public.example` | 0 |

## Inne (auth, storage, cron, realtime)

- `auth_*.csv` – tabele w schemacie `auth` (użytkownicy, sesje, migracje)
- `storage_*.csv`, `realtime_*.csv`, `cron_job.csv` – opcjonalnie, jeśli odtwarzasz cały projekt

## Ponowne wygenerowanie CSV

```bash
node scripts/backup-to-csv.js "/Users/mateuszwlodarczyk/Downloads/db_cluster-10-10-2025@23-40-35 copy.backup"
```

Lub z innego pliku backupu:
```bash
node scripts/backup-to-csv.js /ścieżka/do/pliku.backup
```
