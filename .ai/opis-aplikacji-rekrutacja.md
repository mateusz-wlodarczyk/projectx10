# Opis projektu BoatsStats — do CV / portfolio / rekrutacji

## Krótki opis (1–2 zdania, np. do CV lub LinkedIn)

**BoatsStats** to pełnostackowa aplikacja webowa do zbierania, analizy i wizualizacji danych o rezerwacjach i cenach czarterów jachtów. Zbudowana jako monorepo (Next.js + Node.js/Express), z autentykacją, panelem admina, dashboardem analitycznym i dokumentacją API (OpenAPI/Swagger).

---

## Opis rozszerzony (paragraf, np. do portfolio lub listu motywacyjnego)

BoatsStats to platforma analityczna dla branży czarterów jachtów. Aplikacja automatycznie zbiera dane o rezerwacjach, cenach i dostępności jednostek, przechowuje je w bazie (Supabase/PostgreSQL) i udostępnia je przez REST API (Express, TSOA) z pełną dokumentacją OpenAPI. Frontend (Next.js 14, React 18, TypeScript, Tailwind, komponenty Radix) oferuje: logowanie i rejestrację z resetem hasła, dashboard z metrykami i trendami (ceny, zniżki, dostępność), listę i szczegóły jachtów z filtrowaniem oraz panel administracyjny. Projekt ma strukturę monorepo (npm workspaces), testy jednostkowe (Vitest) i E2E (Playwright), pipeline CI/CD (GitHub Actions), konteneryzację (Docker) i jest przygotowany do wdrożenia (m.in. Netlify).

---

## Kluczowe informacje dla rekrutera

### Zakres odpowiedzialności / wykonane zadania
- Projektowanie i implementacja backendu (Node.js, Express, TypeScript) z warstwą kontrolerów, serwisów i integracją z bazą.
- Definiowanie i udokumentowanie API (TSOA, OpenAPI, Swagger UI) — dziesiątki endpointów (auth, łodzie, dashboard, admin).
- Implementacja frontendu SPA (Next.js App Router, React, TypeScript) z responsywnym UI i dostępnością (Radix UI).
- Autentykacja i autoryzacja (logowanie, rejestracja, reset hasła, role, ochrona tras).
- Automatyzacja zbierania danych (cron, zewnętrzne źródła), przetwarzanie i zapis do bazy.
- Testy: jednostkowe (Vitest) w backendzie i frontendzie, E2E (Playwright), raporty pokrycia.
- Konfiguracja monorepo, skryptów budowania, CI/CD (GitHub Actions), Docker, wdrożenie (Netlify).

### Stack technologiczny
| Warstwa | Technologie |
|--------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Radix UI, Vitest, Playwright |
| **Backend** | Node.js, Express, TypeScript, TSOA, Zod, Supabase (PostgreSQL), Swagger |
| **Infra / DevOps** | npm workspaces (monorepo), Docker, GitHub Actions, Netlify, Google Cloud Logging |

### Wymierne fakty (do CV / rozmowy)
- **53+ endpointów API** z dokumentacją Swagger.
- **79+ komponentów React** i **14 własnych hooków**.
- **Testy jednostkowe i E2E** oraz raporty pokrycia.
- **Pipeline CI/CD**: testy, build, Docker, skanowanie bezpieczeństwa (Trivy).
- **Pełny flow auth**: rejestracja, logowanie, reset hasła, weryfikacja e-mail, role.

### Główne moduły aplikacji
- **Auth** — rejestracja, logowanie, forgot/reset password, weryfikacja e-mail, ochrona tras.
- **Dashboard** — podsumowania, metryki, trendy cen, zniżki, dostępność, przychody.
- **Boats** — lista jachtów z filtrami i paginacją, szczegóły jednostki, dostępność.
- **Admin** — zarządzanie użytkownikami, logi, metryki systemowe.
- **Profil / Ustawienia** — konto użytkownika i preferencje.

### Wykazane umiejętności
- Full-stack (frontend + backend + baza).
- TypeScript w całym stosie.
- REST API, OpenAPI, dokumentacja API.
- Autentykacja i autoryzacja.
- Monorepo, skrypty budowania, testy, CI/CD, Docker.
- Praca z wymaganiami (PRD) i strukturą projektu (komponenty, serwisy, kontrolery).

---

## Wersja ultra-krótka (np. jedna linijka w CV)

**BoatsStats** — pełnostackowa aplikacja analityczna do czarterów jachtów (Next.js, Node.js, TypeScript, Supabase, 53+ endpointów API, auth, dashboard, testy, CI/CD).
