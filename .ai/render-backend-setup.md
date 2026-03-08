# Render – backend (Express API)

Żeby pod **https://projectx10.onrender.com** działał **backend** (Express z `/dashboard/*`, `/boat`, itd.), a nie frontend, w Renderze ta usługa musi budować i uruchamiać backend.

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
- `CORS_ORIGIN` – `https://boats-filter.netlify.app` (frontend na Netlify). **Ważne:** bez tego przy błędach CORS requesty z Netlify mogą być blokowane. Backend domyślnie pozwala na ten origin w produkcji, ale ustawienie zmiennej gwarantuje działanie.  
- `AVAILABILITY_YEAR` – `2025` (jeśli używasz tabeli `boat_availability_2025`)

## Dlaczego wcześniej było 404 i CORS?

- Domyślny **Start Command** w projekcie to `npm start`, który uruchamia **frontend** (Next.js).
- Pod `projectx10.onrender.com` działał więc Next.js, a nie Express.
- Ścieżki `/dashboard/summary`, `/dashboard/revenue` itd. są w **Expressie** (backend). Gdy na Renderze działa tylko frontend, te adresy nie istnieją → **404** i brak nagłówków CORS z backendu.

Po ustawieniu **Build** na `npm run build:backend` i **Start** na `npm run start:backend` pod tym samym URL będzie działał backend i requesty z Netlify zaczną przechodzić (CORS i 200).
