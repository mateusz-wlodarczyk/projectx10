# CI/CD Setup for BoatsStats

Ten dokument opisuje minimalny setup CI/CD dla projektu BoatsStats, który zapewnia automatyczne testowanie i budowanie aplikacji.

## Architektura CI/CD

### GitHub Actions Workflow

Główny workflow znajduje się w `.github/workflows/ci.yml` i zawiera następujące joby:

1. **Unit Tests** - Testy jednostkowe dla frontendu i backendu
2. **E2E Tests** - Testy end-to-end z Playwright
3. **Build Backend** - Budowanie aplikacji backend
4. **Build Frontend** - Budowanie aplikacji frontend
5. **Build Docker Images** - Tworzenie obrazów Docker
6. **Security Scan** - Skanowanie bezpieczeństwa z Trivy
7. **Deploy** - Wdrożenie na produkcję (manualne)

### Triggers

Workflow jest uruchamiany:

- Przy push do branchy `main` i `dev`
- Przy tworzeniu pull request do `main` i `dev`
- Manualnie przez `workflow_dispatch`

## Struktura Plików

```
.github/workflows/
├── ci.yml                 # Główny workflow CI/CD

packages/
├── backend/
│   └── Dockerfile         # Obraz Docker dla backendu
└── frontend/
    └── Dockerfile         # Obraz Docker dla frontendu

scripts/
├── ci-helper.sh          # Skrypty pomocnicze dla CI/CD
└── deploy.sh             # Skrypt wdrożenia na DigitalOcean

docker-compose.yml        # Konfiguracja Docker Compose
nginx.conf               # Konfiguracja Nginx
```

## Użycie Lokalne

### Instalacja zależności

```bash
# Instalacja wszystkich zależności
./scripts/ci-helper.sh install
```

### Uruchamianie testów

```bash
# Wszystkie testy
./scripts/ci-helper.sh test

# Tylko testy jednostkowe
npm run test:ci

# Tylko testy E2E
npm run test:e2e
```

### Budowanie aplikacji

```bash
# Budowanie wszystkich pakietów
./scripts/ci-helper.sh build

# Budowanie obrazów Docker
./scripts/ci-helper.sh docker
```

### Uruchamianie w Docker

```bash
# Uruchomienie kontenerów
./scripts/ci-helper.sh up

# Zatrzymanie kontenerów
./scripts/ci-helper.sh down

# Sprawdzenie statusu
./scripts/ci-helper.sh health
```

## Wdrożenie na Produkcję

### Wymagania

1. Token API DigitalOcean (`DO_TOKEN`)
2. Zainstalowany `doctl`
3. Zainstalowany `docker`

### Proces wdrożenia

```bash
# 1. Ustawienie tokenu API
export DO_TOKEN=your_digitalocean_token

# 2. Utworzenie droplet
./scripts/deploy.sh create

# 3. Konfiguracja droplet
./scripts/deploy.sh setup

# 4. Wdrożenie aplikacji
./scripts/deploy.sh deploy

# 5. Sprawdzenie statusu
./scripts/deploy.sh status
```

### Cleanup

```bash
# Usunięcie droplet i cleanup
./scripts/deploy.sh cleanup
```

## Konfiguracja Środowiska

### Zmienne Środowiskowe

#### Backend (.env)

```env
NODE_ENV=production
PORT=8080
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

#### Frontend

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
BACKEND_URL=http://backend:8080
```

### GitHub Secrets

Wymagane secrets w GitHub:

- `GITHUB_TOKEN` - Automatycznie dostarczany przez GitHub
- `DO_TOKEN` - Token API DigitalOcean (opcjonalnie)

## Monitoring i Logi

### Health Checks

Aplikacja udostępnia endpointy health check:

- Backend: `http://localhost:8080/health`
- Frontend: `http://localhost:3000`

### Logi

Logi są dostępne przez:

```bash
# Logi wszystkich kontenerów
docker-compose logs

# Logi konkretnego serwisu
docker-compose logs backend
docker-compose logs frontend
```

## Troubleshooting

### Problemy z testami

1. **Testy E2E nie przechodzą**

   - Sprawdź czy aplikacja jest uruchomiona na `localhost:3000`
   - Upewnij się że Playwright jest zainstalowany: `npx playwright install`

2. **Problemy z Docker**

   - Sprawdź czy Docker jest uruchomiony
   - Sprawdź czy porty 3000 i 8080 są wolne

3. **Problemy z wdrożeniem**
   - Sprawdź czy token DigitalOcean jest poprawny
   - Upewnij się że `doctl` jest zainstalowany i skonfigurowany

### Debugowanie

```bash
# Sprawdzenie statusu kontenerów
docker-compose ps

# Logi w czasie rzeczywistym
docker-compose logs -f

# Wejście do kontenera
docker-compose exec backend sh
docker-compose exec frontend sh
```

## Rozszerzenia

### Dodatkowe funkcje

1. **Notyfikacje** - Dodanie Slack/Email notifications
2. **Cache** - Optymalizacja cache dla dependencies
3. **Parallel Jobs** - Równoległe uruchamianie jobów
4. **Artifacts** - Przechowywanie build artifacts
5. **Rollback** - Automatyczny rollback przy błędach

### Integracje

1. **Code Quality** - SonarQube, CodeClimate
2. **Security** - Snyk, OWASP ZAP
3. **Performance** - Lighthouse CI
4. **Monitoring** - Sentry, DataDog

## Wsparcie

W przypadku problemów:

1. Sprawdź logi GitHub Actions
2. Sprawdź logi Docker containers
3. Sprawdź dokumentację GitHub Actions
4. Sprawdź dokumentację DigitalOcean API
