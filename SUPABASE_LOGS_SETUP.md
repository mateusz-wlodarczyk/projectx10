# Instrukcja uruchomienia funkcji SQL w Supabase

Aby pobierać prawdziwe logi z Supabase zamiast mock data, należy uruchomić funkcje SQL w bazie danych Supabase.

## Kroki:

1. **Przejdź do Supabase Dashboard:**

   - Otwórz https://supabase.com/dashboard/project/vcuzudiuwzsguzomizqa
   - Przejdź do sekcji "SQL Editor"

2. **Uruchom funkcje SQL:**

   - Skopiuj zawartość pliku `packages/backend/sql/create_logs_function.sql`
   - Wklej kod w SQL Editor
   - Kliknij "Run" aby wykonać zapytania

3. **Funkcje które zostaną utworzone:**

   - `get_postgres_logs(limit_count)` - pobiera logi PostgreSQL
   - `get_database_activity()` - pobiera informacje o aktywności bazy danych

4. **Sprawdzenie:**
   - Po uruchomieniu funkcji, backend będzie próbował pobierać prawdziwe dane
   - W konsoli backendu zobaczysz komunikaty:
     - `✅ Successfully fetched X PostgreSQL logs via RPC function` - jeśli funkcja działa
     - `⚠️ Using application logs as fallback` - jeśli funkcja nie jest dostępna

## Uwagi:

- Funkcje są bezpieczne i nie wpływają na dane produkcyjne
- Jeśli funkcje nie są dostępne, backend automatycznie przełączy się na fallback
- Wszystkie dane są pobierane z backendu, nie ma już mock data w kodzie

## Testowanie:

1. Uruchom backend: `npm run dev` (w folderze packages/backend)
2. Uruchom frontend: `npm run dev` (w folderze packages/frontend)
3. Przejdź do http://localhost:3000/settings
4. Kliknij na zakładkę "Advanced"
5. Sprawdź czy logi są pobierane z backendu (sprawdź konsolę backendu)
