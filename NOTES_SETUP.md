# Notes Management Setup

## Overview

Dodano funkcjonalność zarządzania notatkami w panelu administracyjnym z pełną obsługą CRUD (Create, Read, Update, Delete).

## Struktura bazy danych

### Tabela `notes`

```sql
CREATE TABLE IF NOT EXISTS notes (
  id BIGSERIAL PRIMARY KEY,
  notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

## Backend API Endpoints

### GET /admin/notes

- **Opis**: Pobiera wszystkie notatki
- **Response**: `{ notes: Note[], total: number }`

### POST /admin/notes

- **Opis**: Tworzy nową notatkę
- **Body**: `{ notes: string }`
- **Response**: `{ note: Note, message: string }`

### PUT /admin/notes/{id}

- **Opis**: Aktualizuje istniejącą notatkę
- **Body**: `{ notes: string }`
- **Response**: `{ note: Note, message: string }`

### DELETE /admin/notes/{id}

- **Opis**: Usuwa notatkę
- **Response**: `{ message: string }`

## Frontend Components

### NotesManagement Component

- **Lokalizacja**: `packages/frontend/src/components/admin/NotesManagement.tsx`
- **Funkcjonalności**:
  - Wyświetlanie listy notatek
  - Wyszukiwanie notatek
  - Dodawanie nowych notatek
  - Edycja istniejących notatek
  - Usuwanie notatek
  - Kopiowanie treści notatek do schowka

### Integracja z Admin Page

- Komponent został zintegrowany ze stroną `/admin`
- Wyświetla się poniżej zarządzania użytkownikami

## Instalacja i uruchomienie

### 1. Utworzenie tabeli w bazie danych

```bash
# Uruchom SQL script w Supabase
psql -h your-supabase-host -d your-database -U postgres -f packages/backend/sql/create_notes_table.sql
```

### 2. Uruchomienie backendu

```bash
cd packages/backend
npm run dev
```

### 3. Uruchomienie frontendu

```bash
cd packages/frontend
npm run dev
```

### 4. Dostęp do funkcjonalności

- Przejdź do `http://localhost:3000/admin`
- Zaloguj się jako administrator
- Znajdź sekcję "Notes Management"

## Funkcjonalności

### ✅ Wyświetlanie notatek

- Lista wszystkich notatek w tabeli
- Sortowanie według daty utworzenia (najnowsze na górze)
- Wyświetlanie daty utworzenia i modyfikacji

### ✅ Dodawanie notatek

- Przycisk "Add Note" otwiera dialog
- Pole tekstowe dla treści notatki
- Walidacja - notatka nie może być pusta

### ✅ Edycja notatek

- Przycisk edycji przy każdej notatce
- Otwiera dialog z aktualną treścią
- Możliwość modyfikacji i zapisania

### ✅ Usuwanie notatek

- Przycisk usuwania z potwierdzeniem
- Alert dialog z pytaniem o potwierdzenie
- Bezpieczne usuwanie z walidacją

### ✅ Kopiowanie notatek

- Przycisk kopiowania treści do schowka
- Informacja o pomyślnym skopiowaniu

### ✅ Wyszukiwanie

- Pole wyszukiwania nad tabelą
- Filtrowanie w czasie rzeczywistym
- Wyszukiwanie w treści notatek

## Bezpieczeństwo

- **Row Level Security (RLS)** włączone dla tabeli `notes`
- **Polityki dostępu** dla operacji CRUD
- **Autoryzacja** na poziomie API (wymaga uwierzytelnienia)
- **Walidacja** danych wejściowych

## Testowanie

### Testy jednostkowe

```bash
cd packages/backend
npm test -- AdminController
```

### Testy integracyjne

1. Utwórz notatkę
2. Sprawdź czy została zapisana w bazie
3. Edytuj notatkę
4. Usuń notatkę
5. Sprawdź czy została usunięta

## Troubleshooting

### Błąd: "Supabase client not initialized"

- Sprawdź zmienne środowiskowe `SUPABASE_URL` i `SUPABASE_KEY`
- Upewnij się, że backend ma dostęp do bazy danych

### Błąd: "Failed to fetch notes"

- Sprawdź czy backend działa na porcie 8080
- Sprawdź czy endpoint `/admin/notes` jest dostępny

### Błąd: "Note not found"

- Sprawdź czy notatka istnieje w bazie danych
- Sprawdź czy ID notatki jest poprawne

## Rozszerzenia

Możliwe rozszerzenia funkcjonalności:

- Kategoryzacja notatek
- Tagi dla notatek
- Współdzielenie notatek między użytkownikami
- Eksport notatek do pliku
- Rich text editor dla notatek
- Załączniki do notatek
