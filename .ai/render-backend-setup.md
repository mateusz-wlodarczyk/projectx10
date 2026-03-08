# Render – backend (Express API)

Żeby pod **https://projectx10.onrender.com** działał **backend** (Express z `/dashboard/*`, `/boat`, itd.), a nie frontend, w Renderze ta usługa musi budować i uruchamiać backend.

---

## CORS blokuje requesty z boats-filter.netlify.app? Zrób to:

1. Wejdź w **Render Dashboard** → Twoja usługa (ta pod projectx10.onrender.com).
2. **Settings** (lewa kolumna).
3. **Build & Deploy**:
   - **Build Command:** ustaw na `npm run build:backend` (nie `npm run build` ani nic z frontendem).
   - **Start Command:** ustaw na `npm run start:backend` (nie `npm start` – to uruchamia Next.js).
4. **Environment** (lewa kolumna):
   - Dodaj zmienną **CORS_ORIGIN** = `https://boats-filter.netlify.app`.
   - Upewnij się, że są **SUPABASE_URL** i **SUPABASE_KEY**.
5. **Manual Deploy** → **Deploy latest commit** (albo wypchnij commit i poczekaj na auto-deploy).
6. Po deployu w **Logs** powinno być: `Server is running on port 10000` (lub inny PORT) – to znak, że działa **Express**, nie Next.js. Jeśli widzisz cokolwiek z "Next.js" albo "ready started server on", nadal działa frontend – wróć do punktu 3.

Dopóki **Start Command** to `npm start`, pod projectx10.onrender.com działa **frontend**. Frontend nie ma tras `/dashboard/metrics`, `/boat/list` ani CORS – stąd "No 'Access-Control-Allow-Origin' header".

---

## Ustawienia usługi na Renderze (dla backendu)

1. **Build Command**
   ```bash
   npm run build:backend
   ```
   (albo z roota repozytorium: `npm install && npm run build:backend`)

2. **Start Command**
   ```bash
   npm run start:backend
   ```
   To uruchomi `node packages/backend/dist/index.js` (Express z dashboardem i CORS).

3. **Root Directory** (jeśli Render buduje z roota monorepo)
   - Zostaw puste albo ustaw na root repozytorium (tam gdzie jest `package.json` z `build:backend` i `start:backend`).

## Zmienne środowiskowe (Environment) na Renderze

- `SUPABASE_URL` – URL projektu Supabase  
- `SUPABASE_KEY` – anon key Supabase  
- `CORS_ORIGIN` – (opcjonalne) dodatkowe originy, rozdzielone przecinkami. **`https://boats-filter.netlify.app` jest zawsze dozwolone w produkcji** w kodzie; zmienna służy do dodania np. drugiej domeny.  
- `AVAILABILITY_YEAR` – `2025` (jeśli używasz tabeli `boat_availability_2025`)

## Dlaczego wcześniej było 404 i CORS?

- Domyślny **Start Command** w projekcie to `npm start`, który uruchamia **frontend** (Next.js).
- Pod `projectx10.onrender.com` działał więc Next.js, a nie Express.
- Ścieżki `/dashboard/summary`, `/dashboard/revenue` itd. są w **Expressie** (backend). Gdy na Renderze działa tylko frontend, te adresy nie istnieją → **404** i brak nagłówków CORS z backendu.

Po ustawieniu **Build** na `npm run build:backend` i **Start** na `npm run start:backend` pod tym samym URL będzie działał backend i requesty z Netlify zaczną przechodzić (CORS i 200).
