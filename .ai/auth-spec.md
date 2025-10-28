# Specyfikacja Architektury Systemu Uwierzytelniania - Yacht Booking Analytics

## 1. Przegląd Architektury

System uwierzytelniania dla aplikacji Yacht Booking Analytics będzie zintegrowany z istniejącą architekturą Next.js (frontend) i Node.js z Supabase (backend). Architektura zapewnia bezpieczne uwierzytelnianie użytkowników, kontrolę dostępu opartą na rolach oraz zarządzanie sesjami zgodnie z wymaganiami PRD.

### Główne komponenty:

- **Frontend**: Next.js z React, integracja z Supabase Auth
- **Backend**: Node.js z middleware uwierzytelniania, API endpoints
- **Baza danych**: Supabase PostgreSQL z tabelami użytkowników i ról
- **Uwierzytelnianie**: Supabase Auth z JWT tokens

## 2. Architektura Interfejsu Użytkownika

### 2.1 Struktura Stron i Komponentów

#### Nowe Strony Uwierzytelniania:

```
app/
├── auth/
│   ├── login/
│   │   └── page.tsx              # Strona logowania
│   ├── register/
│   │   └── page.tsx              # Strona rejestracji
│   ├── forgot-password/
│   │   └── page.tsx              # Odzyskiwanie hasła
│   ├── reset-password/
│   │   └── page.tsx              # Reset hasła
│   └── verify-email/
│       └── page.tsx              # Weryfikacja email
```

#### Rozszerzone Komponenty:

```
src/components/
├── auth/
│   ├── AuthProvider.tsx          # Context provider dla uwierzytelniania
│   ├── LoginForm.tsx             # Formularz logowania
│   ├── RegisterForm.tsx          # Formularz rejestracji
│   ├── ForgotPasswordForm.tsx    # Formularz odzyskiwania hasła
│   ├── ResetPasswordForm.tsx     # Formularz resetu hasła
│   ├── AuthGuard.tsx             # Komponent ochrony tras
│   └── UserProfile.tsx           # Profil użytkownika
├── dashboard/
│   ├── NavigationBar.tsx         # Rozszerzona o menu użytkownika
│   └── Sidebar.tsx               # Rozszerzona o kontrolę dostępu
└── admin/
    ├── UserManagement.tsx       # Istniejący - integracja z auth
    └── RoleManagement.tsx        # Istniejący - integracja z auth
```

### 2.2 Rozdzielenie Odpowiedzialności

#### Komponenty React (Client-Side):

- **AuthProvider**: Zarządzanie stanem uwierzytelniania, integracja z Supabase Auth
- **AuthGuard**: Ochrona tras, przekierowania na podstawie stanu uwierzytelniania
- **Formularze**: Walidacja po stronie klienta, obsługa błędów, integracja z Supabase Auth
- **NavigationBar**: Wyświetlanie stanu użytkownika, menu wylogowania

#### Strony Next.js (Server-Side):

- **Strony auth**: Renderowanie formularzy, obsługa przekierowań SSR
- **Middleware**: Ochrona tras na poziomie serwera, weryfikacja sesji
- **Layout**: Integracja z AuthProvider, przekazywanie stanu uwierzytelniania

### 2.3 Walidacja i Obsługa Błędów

#### Walidacja Formularzy:

```typescript
interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}
```

#### Komunikaty Błędów:

- **Walidacja email**: Format, wymagane pole
- **Walidacja hasła**: Długość, złożoność, zgodność z polityką
- **Błędy uwierzytelniania**: Nieprawidłowe dane, konto zablokowane
- **Błędy sieci**: Brak połączenia, timeout
- **Błędy serwera**: Błąd 500, niedostępność usługi

#### Scenariusze Obsługi:

- **Sesja wygasła**: Automatyczne przekierowanie do logowania
- **Brak uprawnień**: Przekierowanie do strony błędu 403
- **Konto niezweryfikowane**: Przekierowanie do weryfikacji email
- **Konto zablokowane**: Wyświetlenie komunikatu o blokadzie

## 3. Logika Backend

### 3.1 Struktura API Endpoints

#### Nowe Endpoints Uwierzytelniania:

```
/api/auth/
├── POST /login                  # Logowanie użytkownika
├── POST /register               # Rejestracja użytkownika
├── POST /logout                 # Wylogowanie
├── POST /refresh-token          # Odświeżanie tokenu
├── POST /forgot-password        # Wysłanie linku resetu
├── POST /reset-password         # Reset hasła
├── POST /verify-email           # Weryfikacja email
├── GET /me                      # Informacje o użytkowniku
└── PUT /profile                 # Aktualizacja profilu
```

#### Endpoints Zarządzania Użytkownikami:

```
/api/users/
├── GET /                        # Lista użytkowników (admin)
├── GET /:id                     # Szczegóły użytkownika
├── PUT /:id                     # Aktualizacja użytkownika
├── DELETE /:id                  # Usunięcie użytkownika
├── PUT /:id/role                # Zmiana roli użytkownika
└── PUT /:id/status              # Zmiana statusu użytkownika
```

### 3.2 Modele Danych

#### Model Użytkownika:

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profile?: UserProfile;
}

interface UserRole {
  id: string;
  name: "admin" | "manager" | "user";
  permissions: Permission[];
  description: string;
}

interface Permission {
  id: string;
  resource: string;
  action: "read" | "write" | "delete" | "admin";
  description: string;
}
```

#### Model Sesji:

```typescript
interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress: string;
  userAgent: string;
}
```

### 3.3 Walidacja Danych Wejściowych

#### Walidacja Rejestracji:

```typescript
const registerSchema = {
  email: {
    required: true,
    type: "email",
    minLength: 5,
    maxLength: 255,
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
};
```

#### Walidacja Logowania:

```typescript
const loginSchema = {
  email: {
    required: true,
    type: "email",
  },
  password: {
    required: true,
    minLength: 1,
  },
};
```

### 3.4 Obsługa Wyjątków

#### Typy Błędów:

- **ValidationError**: Błędy walidacji danych wejściowych
- **AuthenticationError**: Błędy uwierzytelniania
- **AuthorizationError**: Błędy autoryzacji
- **DatabaseError**: Błędy bazy danych
- **NetworkError**: Błędy sieci

#### Middleware Obsługi Błędów:

```typescript
interface ErrorResponse {
  error: string;
  message: string;
  code: string;
  timestamp: Date;
  path: string;
}
```

## 4. System Uwierzytelniania

### 4.1 Integracja z Supabase Auth

#### Konfiguracja Supabase:

```typescript
interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
  authSettings: {
    siteUrl: string;
    redirectTo: string;
    jwtExpiry: number;
    refreshTokenExpiry: number;
  };
}
```

#### Funkcje Uwierzytelniania:

- **signUp**: Rejestracja z weryfikacją email
- **signIn**: Logowanie z opcją "Remember Me"
- **signOut**: Wylogowanie z czyszczeniem sesji
- **resetPassword**: Reset hasła przez email
- **updateUser**: Aktualizacja profilu użytkownika

### 4.2 Zarządzanie Sesjami

#### Token JWT:

```typescript
interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: string;
  iat: number; // Issued at
  exp: number; // Expires at
  sessionId: string;
}
```

#### Refresh Token:

- **Czas życia**: 30 dni
- **Rotacja**: Nowy token przy każdym odświeżeniu
- **Revocation**: Unieważnienie przy wylogowaniu

### 4.3 Kontrola Dostępu (RBAC)

#### Role i Uprawnienia:

```typescript
const ROLES = {
  ADMIN: {
    permissions: ["users:read", "users:write", "users:delete", "system:admin"],
  },
  MANAGER: {
    permissions: [
      "boats:read",
      "boats:write",
      "bookings:read",
      "bookings:write",
    ],
  },
  USER: {
    permissions: ["boats:read", "bookings:read"],
  },
};
```

#### Middleware Autoryzacji:

```typescript
interface AuthMiddleware {
  requireAuth: (req: Request, res: Response, next: NextFunction) => void;
  requireRole: (
    roles: string[]
  ) => (req: Request, res: Response, next: NextFunction) => void;
  requirePermission: (
    permission: string
  ) => (req: Request, res: Response, next: NextFunction) => void;
}
```

### 4.4 Bezpieczeństwo

#### Polityka Haseł:

- **Minimalna długość**: 8 znaków
- **Wymagane**: Wielkie litery, małe litery, cyfry, znaki specjalne
- **Zabronione**: Hasła z słownika, powtarzające się wzorce
- **Historia**: Ostatnie 5 haseł nie mogą być ponownie użyte

#### Ochrona przed Atakami:

- **Rate Limiting**: Maksymalnie 5 prób logowania na 15 minut
- **CSRF Protection**: Tokeny CSRF dla wszystkich formularzy
- **XSS Protection**: Sanityzacja danych wejściowych
- **SQL Injection**: Parametryzowane zapytania

#### Audyt i Logowanie:

```typescript
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  details?: any;
}
```

## 5. Integracja z Istniejącą Aplikacją

### 5.1 Kompatybilność z Istniejącymi Komponentami

#### Rozszerzenie DashboardLayout:

- Integracja z AuthProvider
- Wyświetlanie informacji o użytkowniku
- Kontrola dostępu do funkcji na podstawie roli

#### Rozszerzenie NavigationBar:

- Menu użytkownika z opcjami profilu
- Przycisk wylogowania
- Wskaźnik stanu uwierzytelniania

#### Rozszerzenie AdminPanel:

- Integracja z systemem ról i uprawnień
- Zarządzanie użytkownikami przez Supabase Auth
- Synchronizacja ról między frontend a backend

### 5.2 Migracja Istniejących Danych

#### Strategia Migracji:

1. **Backup**: Kopia istniejących danych użytkowników
2. **Mapowanie**: Mapowanie istniejących ról na nowy system
3. **Import**: Import użytkowników do Supabase Auth
4. **Weryfikacja**: Weryfikacja poprawności migracji

### 5.3 Aktualizacja Konfiguracji

#### Zmienne Środowiskowe:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication Settings
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
SESSION_TIMEOUT=1800
```

#### Konfiguracja Next.js:

```typescript
// next.config.js
module.exports = {
  env: {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
};
```

## 6. Implementacja i Wdrożenie

### 6.1 Etapy Implementacji

#### Etap 1: Podstawowe Uwierzytelnianie

- Konfiguracja Supabase Auth
- Implementacja formularzy logowania i rejestracji
- Podstawowa kontrola dostępu

#### Etap 2: Zarządzanie Użytkownikami

- Panel administracyjny użytkowników
- System ról i uprawnień
- Zarządzanie profilami

#### Etap 3: Zaawansowane Funkcje

- Reset hasła przez email
- Weryfikacja email
- Audyt i logowanie

#### Etap 4: Optymalizacja i Testy

- Testy bezpieczeństwa
- Optymalizacja wydajności
- Dokumentacja

### 6.2 Testowanie

#### Testy Jednostkowe:

- Walidacja formularzy
- Logika uwierzytelniania
- Kontrola dostępu

#### Testy Integracyjne:

- Integracja z Supabase Auth
- API endpoints
- Middleware uwierzytelniania

#### Testy E2E:

- Przepływy uwierzytelniania
- Scenariusze użytkownika
- Testy bezpieczeństwa

### 6.3 Monitorowanie i Obsługa

#### Metryki:

- Liczba aktywnych sesji
- Czas odpowiedzi uwierzytelniania
- Wskaźniki błędów logowania
- Aktywność użytkowników

#### Alerty:

- Nieprawidłowe próby logowania
- Błędy uwierzytelniania
- Problemy z bazą danych
- Naruszenia bezpieczeństwa

## 7. Podsumowanie

Architektura systemu uwierzytelniania dla Yacht Booking Analytics zapewnia:

- **Bezpieczne uwierzytelnianie** z wykorzystaniem Supabase Auth
- **Kontrolę dostępu opartą na rolach** zgodną z wymaganiami PRD
- **Integrację z istniejącą aplikacją** bez naruszania funkcjonalności
- **Skalowalność i wydajność** odpowiednią dla aplikacji biznesowej
- **Zgodność z najlepszymi praktykami** bezpieczeństwa

System jest zaprojektowany tak, aby być łatwym w utrzymaniu, rozszerzalnym i zgodnym z wymaganiami biznesowymi aplikacji analitycznej rezerwacji jachtów.
