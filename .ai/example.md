# Analiza migracji React/Next.js → Angular

## Przegląd aplikacji

### Skala projektu

**Frontend (React/Next.js):**

- 79 komponentów React w `/src/components/`
- 14 custom hooków w `/src/hooks/`
- 18 komponentów UI (shadcn/ui bazujące na Radix UI)
- 12-15 stron/routów (Next.js App Router)
- Testy jednostkowe: ~83 testy (Vitest + React Testing Library)
- Testy E2E: ~55 testów (Playwright)
- React Context API dla autentykacji i stanu globalnego
- Tailwind CSS dla stylowania

**Struktura komponentów:**

```
components/
├── admin/          (7 komponentów)
├── auth/           (8 komponentów)
├── boats/          (19 komponentów)
├── common/         (3 komponenty)
├── dashboard/      (10 komponentów)
├── landing/        (6 komponentów)
├── profile/        (4 komponenty)
├── search/         (6 komponentów)
├── settings/       (10 komponentów)
└── ui/             (18 komponentów UI)
```

**Custom hooki:**

- useBoatDetail.ts
- useBoatDetailPage.ts
- useBoatsData.ts (najbardziej złożony - 722 linie testów)
- useBoatsPage.ts
- useDashboard.ts
- useDashboardPage.ts
- useLogin.ts
- useNavigation.ts
- useProfileForm.ts
- useSettingsPage.ts
- useTabs.ts
- - 3 hooki z testami

## Szczegółowy szacunek czasu

### 1. Setup i konfiguracja projektu (8-12h)

**Zadania:**

- Instalacja Angular CLI
- Inicjalizacja projektu Angular
- Konfiguracja TypeScript (tsconfig.json)
- Setup Angular Router
- Konfiguracja modułów (AppModule, SharedModule, etc.)
- Integracja Tailwind CSS z Angular
- Konfiguracja environment files
- Setup budowania i dev server

### 2. Konwersja komponentów (120-200h)

**Breakdown według kategorii:**

| Kategoria                                        | Ilość | Czas/komponent | Razem   |
| ------------------------------------------------ | ----- | -------------- | ------- |
| **Proste komponenty** (common, ui)               | 21    | 1-1.5h         | 21-32h  |
| **Średnie komponenty** (landing, profile)        | 20    | 1.5-2h         | 30-40h  |
| **Złożone komponenty** (boats, dashboard, admin) | 38    | 2.5-3.5h       | 95-133h |

**Zmiany wymagane w każdym komponencie:**

- JSX → Angular Templates
- Props → @Input()
- Callbacks → @Output() + EventEmitter
- useState → component properties + change detection
- useEffect → ngOnInit, ngOnChanges, ngOnDestroy
- useContext → Services injection
- Conditional rendering → *ngIf, *ngFor
- CSS modules/Tailwind → Angular component styles

**Przykład:**

```typescript
// React (LoginForm.tsx - 223 linie)
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const { login, loading } = useLogin();

  return <form onSubmit={handleSubmit}>...</form>
}

// Angular
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  loading$ = this.authService.loading$;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}
}
```

### 3. Konwersja hooków → Services/Stores (40-60h)

**Wymagane zmiany:**

| Hook           | LOC    | Złożoność                           | Czas szacowany |
| -------------- | ------ | ----------------------------------- | -------------- |
| useBoatsData   | ~200   | Wysoka (cache, pagination, filters) | 6-8h           |
| useDashboard   | ~150   | Wysoka (metrics, charts)            | 5-7h           |
| useBoatDetail  | ~100   | Średnia                             | 3-4h           |
| useLogin       | ~80    | Średnia (auth flow)                 | 3-4h           |
| useNavigation  | ~60    | Niska                               | 2-3h           |
| Pozostałe (10) | varies | Niska-Średnia                       | 20-30h         |

**Transformacja:**

- Custom hooki → Angular Services
- useState → BehaviorSubject / Signal
- useEffect → RxJS operators
- useCallback/useMemo → Compute properties / pipes
- Cache logic → HTTP Interceptors lub Service cache

### 4. Konwersja UI biblioteki (60-90h)

**Wyzwanie:** Radix UI (React) nie ma bezpośredniego odpowiednika w Angular

**Opcje:**

1. **Angular Material** - najbliższy odpowiednik
2. **PrimeNG** - bogatsza biblioteka
3. **Custom components** - najwięcej pracy

**Komponenty do przepisania:**

- Alert Dialog
- Avatar
- Checkbox
- Dialog/Modal
- Dropdown Menu
- Label
- Progress
- Select
- Separator
- Slot
- Switch
- Tabs

**Czas:** ~3-5h per komponent (dostosowanie stylu, API, accessibility)

### 5. Routing (20-30h)

**Next.js App Router → Angular Router**

**Transformacja:**

```
app/
├── admin/page.tsx          → AdminComponent + route guard
├── auth/
│   ├── login/page.tsx      → LoginComponent
│   ├── register/page.tsx   → RegisterComponent
├── boats/
│   ├── [id]/page.tsx       → BoatDetailComponent (:id route param)
│   └── page.tsx            → BoatsComponent
├── dashboard/page.tsx      → DashboardComponent + guard
├── profile/page.tsx        → ProfileComponent + guard
└── settings/page.tsx       → SettingsComponent + guard
```

**Zadania:**

- Konfiguracja route definitions
- Implementacja route guards (CanActivate dla auth)
- Lazy loading modules
- Route resolvers dla data fetching
- Redirect logic
- 404 handling

### 6. State Management (30-50h)

**React Context → Angular Services lub NgRx**

**Opcja 1: Services z RxJS (30h)**

```typescript
@Injectable({ providedIn: "root" })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  login(credentials: Credentials) {
    // ...
  }
}
```

**Opcja 2: NgRx Store (50h)**

- Actions definition
- Reducers
- Effects
- Selectors
- Dev tools

**Rekomendacja:** Start z Services, później NgRx jeśli potrzeba

### 7. Autentykacja (20-30h)

**Komponenty do przepisania:**

- AuthProvider (Context) → AuthService
- AuthGuard → Angular CanActivate guard
- Login flow
- Registration flow
- Password reset flow
- Session management
- Token handling (HTTP Interceptor)

### 8. Formularze i walidacja (20-30h)

**React Hook Form → Angular Reactive Forms**

**Przykład:**

```typescript
// React
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

// Angular
this.loginForm = this.fb.group({
  email: ["", [Validators.required, Validators.email]],
  password: ["", [Validators.required, Validators.minLength(8)]],
});
```

**Formularze do migracji:**

- LoginForm
- RegisterForm
- ForgotPasswordForm
- ResetPasswordForm
- ProfileForm
- Search filters
- Boat filters
- Admin forms

### 9. Przepisanie testów jednostkowych (80-120h)

**Vitest + React Testing Library → Jasmine/Jest + Angular Testing**

**Różnice:**

```typescript
// React Testing Library
const { result } = renderHook(() => useBoatsData());
expect(result.current.boats).toEqual([]);

// Angular Testing
TestBed.configureTestingModule({
  providers: [BoatsService],
});
const service = TestBed.inject(BoatsService);
service.boats$.subscribe((boats) => {
  expect(boats).toEqual([]);
});
```

**83 testy do przepisania:**

- useBoatsData.test.ts (722 linie!) → BoatsService.spec.ts
- useDashboard.test.ts → DashboardService.spec.ts
- LoginForm.test.tsx → LoginFormComponent.spec.ts
- Component tests
- Hook tests → Service tests

### 10. Przepisanie testów E2E (30-50h)

**Playwright testy (55 testów)**

**Opcje:**

1. **Zachować Playwright** - minimalne zmiany (selektory, timing)
2. **Przepisać na Protractor/Cypress** - więcej pracy

**Rekomendacja:** Zachować Playwright, dostosować selektory

### 11. Stylowanie i UI polish (30-50h)

**Zadania:**

- Tailwind CSS classes adjustment
- Component-specific styles
- Animations (React → Angular animations)
- Responsive design verification
- Theme configuration
- Dark mode (jeśli jest)

### 12. Debugowanie i integracja (40-80h)

**Typowe problemy:**

- Change detection issues
- Memory leaks (rxjs subscriptions)
- Performance bottlenecks
- API integration bugs
- Route navigation issues
- Form validation edge cases
- Browser compatibility
- Mobile responsiveness

### 13. Dokumentacja (10-20h)

**Aktualizacja:**

- README.md
- Component documentation
- Service documentation
- API documentation
- Development setup
- Deployment instructions

## Całkowity szacunek czasu

| Kategoria         | Min      | Max      | Średnia  |
| ----------------- | -------- | -------- | -------- |
| Setup             | 8h       | 12h      | 10h      |
| Komponenty        | 120h     | 200h     | 160h     |
| Hooki → Services  | 40h      | 60h      | 50h      |
| UI biblioteka     | 60h      | 90h      | 75h      |
| Routing           | 20h      | 30h      | 25h      |
| State Management  | 30h      | 50h      | 40h      |
| Autentykacja      | 20h      | 30h      | 25h      |
| Formularze        | 20h      | 30h      | 25h      |
| Testy jednostkowe | 80h      | 120h     | 100h     |
| Testy E2E         | 30h      | 50h      | 40h      |
| Stylowanie        | 30h      | 50h      | 40h      |
| Debugowanie       | 40h      | 80h      | 60h      |
| Dokumentacja      | 10h      | 20h      | 15h      |
| **RAZEM**         | **508h** | **822h** | **665h** |

## Przeliczenie na dni robocze

**Dla senior developera:**

- **8h/dzień:** 84 dni robocze (~4 miesiące)
- **6h/dzień efektywnej pracy:** 111 dni roboczych (~5.5 miesiąca)

**Z buforem na nieoczekiwane problemy (+20%):**

- **Realistyczny szacunek: 6-7 miesięcy**

## Kluczowe wyzwania

### 1. Zmiana paradygmatu (Wysoki priorytet)

**React Hooks → Angular Services/RxJS**

- Fundamentalnie różne podejście do state management
- useEffect → RxJS operators (switchMap, combineLatest, etc.)
- useState → BehaviorSubject/Signal
- Krzywa uczenia się dla zespołu

### 2. Brak bezpośredniego odpowiednika Radix UI (Wysoki priorytet)

**Problem:**

- Radix UI jest specyficzny dla React
- Angular Material ma inne API i style
- PrimeNG ma inne komponenty

**Rozwiązanie:**

- Wybrać Angular Material lub PrimeNG
- Stworzyć wrapper komponenty dla spójnego API
- Dostosować style do obecnego designu

### 3. Next.js SSR → Angular Universal (Średni priorytet)

**Wymagane:**

- Konfiguracja Angular Universal
- Server-side rendering setup
- Prerendering configuration
- SEO meta tags handling

### 4. Testy - całkowicie inna filozofia (Wysoki priorytet)

**React Testing Library:**

- Skupia się na user interactions
- Query API (getByRole, getByText)

**Angular Testing:**

- TestBed configuration
- Component fixture
- Dependency injection testing
- Async testing z fakeAsync/tick

### 5. Routing (Średni priorytet)

**Next.js:**

- File-based routing
- Automatic code splitting
- Server components

**Angular:**

- Explicit route configuration
- Manual lazy loading
- Route guards

## Analiza ryzyka

### Wysokie ryzyko

1. **Regression bugs** - przepisanie działającego kodu zawsze niesie ryzyko
2. **Breaking existing features** - złożone komponenty mogą stracić funkcjonalność
3. **Performance degradation** - niewłaściwe użycie change detection
4. **Team learning curve** - jeśli zespół nie zna Angular

### Średnie ryzyko

1. **Timeline overrun** - szacunki mogą być niedoszacowane
2. **Testing gaps** - niektóre edge cases mogą zostać pominięte
3. **UI/UX inconsistencies** - różne komponenty UI mogą wyglądać inaczej

### Niskie ryzyko

1. **Backend compatibility** - backend pozostaje bez zmian
2. **Database issues** - brak wpływu na bazę danych

## Rekomendacje

### Czy warto migrować?

**NIE WARTO jeśli:**

- Aplikacja działa stabilnie
- Zespół zna dobrze React
- Brak biznesowych powodów do zmiany
- Budget jest ograniczony

**WARTO jeśli:**

- Wymagania klienta/organizacji (np. standardy korporacyjne)
- Długoterminowa strategia technologiczna
- Dostępne zasoby i czas (6-7 miesięcy)
- Zespół chce/musi nauczyć się Angular

### Alternatywne podejścia

#### 1. Micro-frontends

- Nowe features w Angular
- Istniejące features w React
- Stopniowa migracja
- Czas: 2-3 miesiące setup + rozwój

#### 2. Optymalizacja React

- Jeśli problem to performance
- Dodanie optymalizacji (React.memo, useMemo)
- Code splitting improvements
- Czas: 2-4 tygodnie

#### 3. Etapowa migracja

- Migracja page by page
- Najpierw najmniej krytyczne
- Testowanie w produkcji stopniowo
- Czas: 8-12 miesięcy

#### 4. Pozostać przy React

- Upgrade do najnowszego React/Next.js
- Dodanie nowych features
- Refactoring zamiast rewrite
- Czas: ongoing

## Koszty biznesowe

### Koszty bezpośrednie

- 665h × stawka senior developer
- Czas innych developerów na code review
- Czas QA na testing
- Czas PM na zarządzanie projektem

### Koszty pośrednie

- **Opportunity cost:** brak nowych features przez 6-7 miesięcy
- **Risk cost:** potencjalne bugi w produkcji
- **Training cost:** nauka Angular dla zespołu
- **Maintenance cost:** utrzymanie dwóch wersji podczas migracji

### Przykładowe wyliczenie

```
Senior Developer: 665h × $80/h = $53,200
Code Review: 100h × $80/h = $8,000
QA Testing: 120h × $60/h = $7,200
PM Overhead: 80h × $90/h = $7,200
TOTAL: ~$75,600
```

## Wnioski

### Szacunek finalny: 665 godzin (6-7 miesięcy)

**Rekomendacja:**
Przeprowadzić głęboką analizę biznesową przed podjęciem decyzji. Migracja z React na Angular to znaczący wysiłek, który powinien być uzasadniony silnymi powodami biznesowymi lub technologicznymi, a nie tylko preferencjami technologicznymi.

**Alternatywa:**
Jeśli to możliwe, rozważyć pozostanie przy React i skupienie się na dostarczaniu wartości biznesowej zamiast przepisywania działającego kodu.


