# Naprawa buildu Netlify

## Co jest nie tak

- W logu: **"No config file was defined"** — Netlify nie widzi `netlify.toml` z repo (albo buduje inne repo/gałąź).
- **"Publish directory: out"** z UI — dla Next.js ma być **`.next`**.
- Uruchamia się **Astro** (`10x-astro-starter`, `astro build`) zamiast Next.js — czyli build idzie z **głównego katalogu innego projektu**, a nie z `packages/frontend` tego monorepo.

## Co zrobić (krok po kroku)

### 1. Sprawdź, które repo i gałąź buduje Netlify

W Netlify: **Site configuration → Build & deploy → Build settings**.

- **Repository** — ma być repozytorium z tym monorepo (np. `mateusz-wlodarczyk/projectx10`), gdzie w root jest `netlify.toml` i folder `packages/frontend` z Next.js.
- **Branch** — gałąź, na którą pushujesz (np. `main`).

Jeśli podpięte jest inne repo (np. projekt z Astro w root), Netlify będzie budował Astro i nie znajdzie `netlify.toml` z BoatsStats. Wtedy **podłącz właściwe repo** (to z `packages/frontend` i Next.js) albo zmień branch na ten, gdzie jest ten kod.

### 2. Ustaw Build settings tak, żeby budować Next.js

W **Site configuration → Build & deploy → Build settings**:

| Ustawienie           | Wartość                | Uwaga |
|----------------------|------------------------|--------|
| **Base directory**   | `packages/frontend`    | Obowiązkowe — wtedy buduje się Next.js, nie Astro z root. |
| **Build command**    | `npm install && npm run build` | Możesz zostawić puste, żeby użyć z `netlify.toml`. |
| **Publish directory**| **`.next`**            | Nie zostawiaj `out`. Albo ustaw `.next`, albo wyczyść pole (wtedy weźmie z `netlify.toml`). |

Zapisz zmiany.

### 3. Zweryfikuj, że w repo jest dobry `netlify.toml`

W **root** repozytorium, które buduje Netlify (np. projectx10), powinien być plik:

**netlify.toml:**
```toml
[build]
  base    = "packages/frontend"
  command = "npm install && npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Jeśli w UI ustawisz **Base directory** na `packages/frontend` i **Publish directory** na `.next`, build powinien przejść nawet gdy Netlify nie wczyta tego pliku.

### 4. (Opcjonalnie) Zaktualizuj plugin Next.js

W logu: *"@netlify/plugin-nextjs@4.41.6: latest version is 5.15.8"*.

W Netlify: **Site configuration → Build & deploy → Plugins** → odinstaluj **@netlify/plugin-nextjs**, potem dodaj go ponownie z [katalogu pluginów](https://app.netlify.com/plugins) (zainstaluje się nowsza wersja).

---

## Podsumowanie

- Budowany musi być **ten** monorepo (z `packages/frontend` i Next.js), nie projekt z Astro w root.
- W Build settings: **Base directory** = `packages/frontend`, **Publish directory** = `.next`.
- Wtedy Netlify zbuduje Next.js i plugin znajdzie katalog `.next`.
