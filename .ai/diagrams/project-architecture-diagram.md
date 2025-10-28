# Boats Stats Project Architecture Diagram

This document contains the complete ASCII architecture diagram showing the structure, components, and dependencies of the Boats Stats project.

## Project Overview

The Boats Stats project is a full-stack application built with:
- **Frontend**: Next.js 14 with React 18, TypeScript, and Tailwind CSS
- **Backend**: Express.js with TypeScript, TSOA, and Supabase
- **Database**: PostgreSQL via Supabase with Row Level Security
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Architecture**: Monorepo managed with Lerna

## Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BOATS STATS PROJECT ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 ROOT PROJECT                                    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │
│  │   Lerna Workspace│    │   Playwright    │    │   Testing Docs  │              │
│  │   Management     │    │   E2E Tests     │    │   TESTING.md    │              │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐
            │   FRONTEND    │ │   BACKEND │ │   DATABASE   │
            │   (Next.js)   │ │ (Express) │ │ (Supabase)   │
            └───────────────┘ └───────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                APP STRUCTURE                                    │
│                                                                                 │
│  app/                                                                           │
│  ├── layout.tsx                    # Root layout with providers                │
│  ├── page.tsx                     # Home page                                  │
│  ├── globals.css                  # Global styles (Tailwind)                  │
│  ├── auth/                        # Authentication pages                      │
│  │   ├── login/page.tsx          # Login form                                 │
│  │   ├── register/page.tsx       # Registration form                         │
│  │   ├── forgot-password/page.tsx # Password recovery                         │
│  │   ├── reset-password/page.tsx  # Password reset                           │
│  │   └── verify-email/page.tsx   # Email verification                         │
│  ├── dashboard/page.tsx           # Main dashboard                             │
│  ├── boats/                       # Boat listing and details                   │
│  │   ├── page.tsx                # Boat list page                             │
│  │   └── [id]/page.tsx           # Individual boat details                    │
│  ├── admin/page.tsx              # Admin panel                               │
│  ├── profile/page.tsx            # User profile                               │
│  ├── settings/page.tsx            # User settings                              │
│  └── unauthorized/page.tsx        # Access denied page                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              COMPONENT ARCHITECTURE                            │
│                                                                                 │
│  src/components/                                                                │
│  ├── common/                    # Shared components                            │
│  │   └── ErrorBoundary.tsx     # Error handling wrapper                       │
│  ├── auth/                      # Authentication components                    │
│  │   ├── AuthProvider.tsx      # Auth context provider                        │
│  │   ├── AuthGuard.tsx         # Route protection                            │
│  │   ├── LoginForm.tsx         # Login form component                         │
│  │   ├── RegisterForm.tsx      # Registration form                            │
│  │   ├── ForgotPasswordForm.tsx # Password recovery form                     │
│  │   ├── ResetPasswordForm.tsx  # Password reset form                        │
│  │   └── UserProfile.tsx       # User profile component                      │
│  ├── boats/                     # Boat-related components                     │
│  │   ├── BoatsGrid.tsx         # Boat grid/list view                         │
│  │   ├── BoatsHeader.tsx       # Search, filters, view controls             │
│  │   ├── BoatsPagination.tsx   # Pagination controls                          │
│  │   ├── BoatsFilters.tsx      # Filter controls                              │
│  │   ├── SearchBox.tsx        # Search input                                 │
│  │   ├── BoatDetailHeader.tsx  # Boat detail page header                     │
│  │   ├── BoatBasicInfo.tsx    # Basic boat information                       │
│  │   ├── BoatParameters.tsx   # Boat specifications                         │
│  │   ├── BoatAvailability.tsx # Availability calendar                        │
│  │   ├── BoatImageGallery.tsx # Image gallery                                │
│  │   ├── BoatLocation.tsx     # Location information                         │
│  │   ├── BoatPricing.tsx      # Pricing information                          │
│  │   ├── BoatReviews.tsx      # Reviews section                              │
│  │   ├── BoatSpecifications.tsx # Technical specifications                   │
│  │   ├── BoatQuickInfo.tsx    # Quick info card                              │
│  │   ├── RelatedBoats.tsx     # Related boats suggestions                    │
│  │   ├── WeeklyPriceChart.tsx # Price trend chart                            │
│  │   └── DiscountChart.tsx    # Discount analysis chart                      │
│  ├── dashboard/                 # Dashboard components                        │
│  │   ├── DashboardLayout.tsx  # Main dashboard layout                       │
│  │   ├── DashboardHeader.tsx  # Dashboard header                             │
│  │   ├── NavigationBar.tsx   # Main navigation                              │
│  │   ├── KeyMetricsCards.tsx  # Key metrics display                          │
│  │   ├── SummaryStats.tsx     # Summary statistics                           │
│  │   ├── AvailabilityChart.tsx # Availability trends                        │
│  │   ├── RevenueChart.tsx     # Revenue analytics                            │
│  │   ├── WeeklyPriceChart.tsx # Price trends (reused)                      │
│  │   └── DiscountChart.tsx    # Discount analysis (reused)                  │
│  ├── admin/                     # Admin panel components                      │
│  │   ├── AdminHeader.tsx      # Admin panel header                           │
│  │   ├── UserManagement.tsx   # User administration                          │
│  │   ├── RoleManagement.tsx   # Role and permissions                          │
│  │   ├── SystemSettings.tsx  # System configuration                         │
│  │   ├── SyncOperations.tsx   # Data synchronization                          │
│  │   └── AdminLogs.tsx       # System logs viewer                           │
│  ├── search/                    # Search functionality                       │
│  │   ├── SearchHeader.tsx    # Search page header                            │
│  │   ├── SearchResults.tsx   # Search results display                        │
│  │   ├── SearchFilters.tsx   # Search filters                                │
│  │   ├── SearchPagination.tsx # Search pagination                            │
│  │   ├── SearchHistory.tsx   # Search history                                │
│  │   └── SavedSearches.tsx   # Saved searches                                │
│  ├── settings/                  # Settings components                          │
│  │   ├── SettingsHeader.tsx  # Settings page header                          │
│  │   ├── GeneralSettings.tsx # General settings                             │
│  │   ├── SecuritySettings.tsx # Security settings                            │
│  │   ├── AdvancedSettings.tsx # Advanced settings                           │
│  │   ├── IntegrationSettings.tsx # Integration settings                      │
│  │   ├── SystemHealthMonitor.tsx # System health monitoring                 │
│  │   ├── SystemLogsMonitor.tsx # System logs monitoring                      │
│  │   ├── LogsMonitor.tsx     # Logs monitoring                               │
│  │   ├── CronLogsMonitor.tsx # Cron job logs                                │
│  │   └── SystemMaintenance.tsx # System maintenance                          │
│  └── ui/                        # UI components (Shadcn/UI)                │
│      ├── button.tsx            # Button component                             │
│      ├── card.tsx              # Card component                               │
│      ├── input.tsx             # Input component                              │
│      ├── label.tsx             # Label component                              │
│      ├── select.tsx            # Select component                            │
│      ├── tabs.tsx              # Tabs component                              │
│      ├── table.tsx             # Table component                             │
│      ├── alert.tsx             # Alert component                             │
│      ├── dialog.tsx            # Dialog component                            │
│      ├── avatar.tsx            # Avatar component                            │
│      ├── badge.tsx             # Badge component                              │
│      ├── checkbox.tsx          # Checkbox component                           │
│      ├── dropdown-menu.tsx    # Dropdown menu component                      │
│      ├── progress.tsx          # Progress component                           │
│      ├── separator.tsx         # Separator component                          │
│      ├── switch.tsx            # Switch component                             │
│      └── textarea.tsx          # Textarea component                           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CUSTOM HOOKS & LOGIC                              │
│                                                                                 │
│  src/hooks/                                                                     │
│  ├── useBoatsData.ts          # Boat listing and filtering logic               │
│  ├── useBoatDetail.ts         # Individual boat data management               │
│  └── useDashboard.ts          # Dashboard analytics data                       │
│                                                                                 │
│  src/types/                                                                     │
│  ├── admin.ts                 # Admin-related type definitions                │
│  ├── boat-detail.ts          # Boat detail type definitions                  │
│  ├── dashboard.ts            # Dashboard type definitions                     │
│  └── logs.ts                 # Log type definitions                          │
│                                                                                 │
│  src/config/                                                                   │
│  └── urls.ts                 # API endpoint configurations                    │
│                                                                                 │
│  src/lib/                                                                      │
│  ├── utils.ts                # Utility functions                             │
│  └── mock-data.ts            # Mock data for development                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                SERVER STRUCTURE                                │
│                                                                                 │
│  src/                                                                           │
│  ├── index.ts                  # Main server entry point                      │
│  ├── config/                   # Configuration files                          │
│  │   ├── constans.ts          # Application constants                         │
│  │   └── urls.ts              # External API URLs                            │
│  ├── controllers/              # Request handlers                              │
│  │   ├── BaseController.ts    # Base controller class                         │
│  │   ├── BoatsController.ts   # Boat-related endpoints                       │
│  │   ├── DashboardController.ts # Dashboard endpoints                         │
│  │   ├── AuthController.ts    # Authentication endpoints                      │
│  │   └── AdminController.ts    # Admin endpoints                              │
│  ├── services/                 # Business logic layer                         │
│  │   ├── SupabaseService.ts   # Database operations                          │
│  │   ├── BoatAroundService.ts  # External API integration                     │
│  │   ├── DashboardService.ts   # Dashboard analytics                          │
│  │   └── Logger.ts            # Logging service                              │
│  ├── middleware/                # Express middleware                           │
│  │   └── rateLimiter.ts       # Rate limiting middleware                      │
│  ├── routes/                   # Route definitions                            │
│  │   └── routes.ts            # TSOA-generated routes                        │
│  ├── api/                      # API definitions                              │
│  │   ├── index.ts             # Main API configuration                        │
│  │   ├── boats.ts             # Boat API definitions                         │
│  │   └── RepositoryService.ts # Repository pattern implementation           │
│  ├── swagger/                  # API documentation                            │
│  │   ├── swagger.ts           # Swagger configuration                        │
│  │   └── swagger.json         # Generated API documentation                  │
│  ├── types/                    # TypeScript type definitions                  │
│  │   ├── availabilityBoat.ts  # Boat availability types                      │
│  │   ├── dashboard.ts         # Dashboard types                              │
│  │   ├── dictionaries.ts      # Dictionary types                              │
│  │   ├── priceBoat.ts         # Boat pricing types                           │
│  │   ├── savedBoatsResults.ts # Saved boats types                            │
│  │   ├── searchedBoat.ts      # Search result types                          │
│  │   └── searchedBoatSingleTypes.ts # Single boat search types              │
│  ├── utils/                    # Utility functions                            │
│  │   ├── getBoatData.ts       # Boat data processing                         │
│  │   ├── handleErrors.ts      # Error handling utilities                     │
│  │   ├── handleFilteredSlugWeek.ts # Week filtering logic                    │
│  │   ├── mockData.ts          # Mock data for testing                         │
│  │   ├── processBoats.ts      # Boat data processing                          │
│  │   ├── selectDataArrayChecking.ts # Data validation                        │
│  │   ├── sleep.ts             # Delay utility                                 │
│  │   └── validation.ts       # Input validation                              │
│  └── test/                     # Test files                                   │
│      ├── setup.ts             # Test setup and mocks                          │
│      └── setup.test.ts       # Test configuration verification               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API ENDPOINTS STRUCTURE                           │
│                                                                                 │
│  Boats Resource:                                                                │
│  ├── GET /boat/list           # Paginated boat listing with filters           │
│  ├── GET /boat/search/{slug}  # Individual boat search                        │
│  ├── GET /boat/details/{slug} # Detailed boat information                      │
│  ├── GET /boat/availability/{slug} # Boat availability data                   │
│  └── GET /boat/health        # Health check endpoint                          │
│                                                                                 │
│  Dashboard Resource:                                                            │
│  ├── GET /dashboard/summary   # Dashboard summary metrics                     │
│  ├── GET /dashboard/metrics   # Key performance indicators                     │
│  ├── GET /dashboard/price-trends # Weekly price analysis                      │
│  ├── GET /dashboard/discount-trends # Discount tracking                        │
│  ├── GET /dashboard/availability # Availability trends                         │
│  ├── GET /dashboard/revenue   # Revenue analytics                              │
│  ├── GET /dashboard/stats     # Statistical data                               │
│  └── GET /dashboard/health    # Health check endpoint                         │
│                                                                                 │
│  Authentication Resource:                                                       │
│  ├── POST /auth/login         # User login                                    │
│  ├── POST /auth/register      # User registration                             │
│  ├── POST /auth/logout        # User logout                                   │
│  └── GET /auth/profile        # User profile data                             │
│                                                                                 │
│  Admin Resource:                                                               │
│  ├── GET /admin/logs          # System logs                                   │
│  ├── GET /admin/users          # User management                               │
│  └── POST /admin/sync          # Data synchronization                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                SUPABASE STRUCTURE                              │
│                                                                                 │
│  Database Tables:                                                               │
│  ├── boats_list               # Main boats catalog                            │
│  │   ├── id (Primary Key)    # Unique boat identifier                        │
│  │   ├── name                 # Boat name                                      │
│  │   ├── slug                 # URL-friendly identifier                      │
│  │   ├── type                 # Boat type (sailboat, motorboat, etc.)          │
│  │   ├── length               # Boat length                                   │
│  │   ├── capacity             # Passenger capacity                             │
│  │   ├── price_per_week       # Weekly rental price                           │
│  │   ├── location             # Boat location                                 │
│  │   ├── images               # Boat images array                               │
│  │   ├── specifications      # Technical specifications                      │
│  │   ├── amenities            # Available amenities                             │
│  │   ├── availability        # Availability data                              │
│  │   └── created_at/updated_at # Timestamps                                   │
│  ├── profiles                 # User profiles                                  │
│  │   ├── id (Primary Key)    # User identifier                               │
│  │   ├── email                # User email                                    │
│  │   ├── full_name            # User full name                                 │
│  │   ├── role                 # User role (user, admin)                        │
│  │   ├── preferences          # User preferences                              │
│  │   └── created_at/updated_at # Timestamps                                   │
│  ├── logs                     # System logs                                    │
│  │   ├── id (Primary Key)    # Log entry identifier                          │
│  │   ├── level                # Log level (info, warn, error)                 │
│  │   ├── message              # Log message                                    │
│  │   ├── context              # Additional context data                       │
│  │   ├── user_id              # Associated user (if applicable)               │
│  │   └── created_at           # Timestamp                                      │
│  └── availability_weeks      # Weekly availability data                       │
│      ├── id (Primary Key)    # Availability record identifier                 │
│      ├── boat_id              # Reference to boats_list                       │
│      ├── week_start           # Week start date                               │
│      ├── week_end             # Week end date                                 │
│      ├── is_available         # Availability status                           │
│      ├── price                # Week price                                    │
│      ├── discount_percentage  # Discount percentage                            │
│      └── created_at/updated_at # Timestamps                                   │
│                                                                                 │
│  Row Level Security (RLS):                                                      │
│  ├── boats_list               # Public read access                            │
│  ├── profiles                 # User can only access own profile              │
│  ├── logs                     # Admin-only access                             │
│  └── availability_weeks      # Public read access                            │
│                                                                                 │
│  Functions:                                                                     │
│  ├── create_logs_function     # Function for logging                          │
│  └── create_profiles_table    # Function for profile management              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TESTING ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                TEST STRUCTURE                                  │
│                                                                                 │
│  Unit Tests (Vitest):                                                           │
│  ├── Frontend Tests:                                                           │
│  │   ├── packages/frontend/src/test/                                          │
│  │   │   ├── setup.ts              # Global mocks and configuration           │
│  │   │   └── setup.test.tsx       # Test configuration verification          │
│  │   ├── packages/frontend/__tests__/                                        │
│  │   │   └── frontend.test.js     # Basic frontend tests                      │
│  │   └── vitest.config.ts         # Frontend test configuration              │
│  └── Backend Tests:                                                            │
│      ├── packages/backend/src/test/                                           │
│      │   ├── setup.ts              # Global mocks and configuration           │
│      │   └── setup.test.ts        # Test configuration verification          │
│      ├── packages/backend/__tests__/                                          │
│      │   └── backend.test.ts      # Basic backend tests                       │
│      └── vitest.config.ts          # Backend test configuration              │
│                                                                                 │
│  E2E Tests (Playwright):                                                       │
│  ├── e2e/                                                                      │
│  │   ├── auth.spec.ts             # Authentication flow tests                │
│  │   └── page-objects/            # Page Object Model                       │
│  │       ├── BasePage.ts          # Base page object                          │
│  │       ├── LoginPage.ts         # Login page object                         │
│  │       └── DashboardPage.ts     # Dashboard page object                     │
│  ├── playwright.config.ts         # Playwright configuration                  │
│  └── playwright-report/           # Test reports                             │
│                                                                                 │
│  Test Scripts:                                                                  │
│  ├── Root Level:                                                                │
│  │   ├── npm run test:all         # Run all tests                            │
│  │   ├── npm run test:e2e         # Run E2E tests                            │
│  │   ├── npm run test:e2e:ui      # E2E tests with UI                        │
│  │   ├── npm run test:unit:frontend # Frontend unit tests                     │
│  │   └── npm run test:unit:backend  # Backend unit tests                     │
│  ├── Frontend Package:                                                          │
│  │   ├── npm run test             # Watch mode                               │
│  │   ├── npm run test:ui          # UI mode                                  │
│  │   ├── npm run test:coverage    # Coverage report                          │
│  │   └── npm run test:run         # Single run                               │
│  └── Backend Package:                                                          │
│      ├── npm run test              # Watch mode                              │
│      ├── npm run test:ui           # UI mode                                  │
│      ├── npm run test:coverage     # Coverage report                         │
│      └── npm run test:run          # Single run                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DEPENDENCY GRAPH                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                DEPENDENCIES                                    │
│                                                                                 │
│  Frontend Dependencies:                                                         │
│  ├── Core Framework:                                                           │
│  │   ├── next@^14.0.0              # React framework                          │
│  │   ├── react@^18.2.0             # UI library                              │
│  │   └── react-dom@^18.2.0         # DOM rendering                           │
│  ├── UI Components:                                                             │
│  │   ├── @radix-ui/*               # Headless UI components                   │
│  │   ├── class-variance-authority   # Component variants                      │
│  │   ├── clsx                       # Conditional classes                     │
│  │   ├── tailwind-merge             # Tailwind class merging                  │
│  │   └── tailwindcss-animate        # Tailwind animations                     │
│  ├── Icons & Graphics:                                                          │
│  │   └── lucide-react               # Icon library                            │
│  ├── Development Tools:                                                         │
│  │   ├── typescript@^5.2.0         # TypeScript                              │
│  │   ├── eslint                    # Linting                                  │
│  │   ├── tailwindcss               # CSS framework                            │
│  │   ├── postcss                   # CSS processing                           │
│  │   └── autoprefixer              # CSS vendor prefixes                      │
│  └── Testing Tools:                                                            │
│      ├── vitest@^3.2.4             # Test runner                             │
│      ├── @vitest/ui                # Test UI                                  │
│      ├── @testing-library/react    # React testing utilities                │
│      ├── @testing-library/jest-dom # DOM testing utilities                    │
│      ├── @testing-library/user-event # User interaction testing               │
│      ├── jsdom                      # DOM environment                          │
│      ├── @vitejs/plugin-react      # React plugin for Vite                    │
│      └── vite@^7.1.10              # Build tool                              │
│                                                                                 │
│  Backend Dependencies:                                                          │
│  ├── Core Framework:                                                           │
│  │   ├── express@^4.21.2           # Web framework                          │
│  │   ├── typescript@^5.8.2         # TypeScript                              │
│  │   └── ts-node@^10.9.2           # TypeScript execution                   │
│  ├── API & Documentation:                                                      │
│  │   ├── tsoa@^6.6.0               # TypeScript OpenAPI                       │
│  │   ├── swagger-jsdoc@^6.2.8      # Swagger documentation                   │
│  │   └── swagger-ui-express@^5.0.1 # Swagger UI                              │
│  ├── Database & Auth:                                                          │
│  │   ├── @supabase/supabase-js@^2.49.1 # Supabase client                     │
│  │   └── zod@^3.22.4               # Schema validation                       │
│  ├── External APIs:                                                            │
│  │   └── axios@^1.8.4              # HTTP client                             │
│  ├── Middleware & Security:                                                    │
│  │   ├── cors@^2.8.5               # CORS handling                          │
│  │   ├── helmet@^7.1.0             # Security headers                        │
│  │   ├── express-rate-limit@^7.1.5 # Rate limiting                           │
│  │   └── body-parser@^2.2.0        # Request parsing                         │
│  ├── Utilities:                                                                │
│  │   ├── date-fns@^4.1.0           # Date manipulation                       │
│  │   ├── dotenv@^16.4.7            # Environment variables                    │
│  │   └── node-cron@^4.1.0          # Cron jobs                               │
│  ├── Cloud Services:                                                           │
│  │   └── @google-cloud/logging@^11.2.0 # Google Cloud logging                │
│  ├── Development Tools:                                                        │
│  │   ├── eslint@^9.22.0            # Linting                                 │
│  │   ├── prettier@^3.5.3           # Code formatting                         │
│  │   └── typescript-eslint@^8.27.0 # TypeScript ESLint                       │
│  └── Testing Tools:                                                            │
│      ├── vitest@^3.2.4             # Test runner                             │
│      └── @vitest/ui                # Test UI                                  │
│                                                                                 │
│  Root Dependencies:                                                             │
│  ├── lerna@^8.2.1                 # Monorepo management                      │
│  └── @playwright/test@^1.56.1     # E2E testing                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                DATA FLOW DIAGRAM                               │
│                                                                                 │
│  External API (BoatAround)                                                     │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐                                                           │
│  │ BoatAroundService│ ◄─── Rate Limiting (24s delay)                         │
│  │                 │ ◄─── Error Handling & Retries                             │
│  │                 │ ◄─── Fallback to Mock Data                                │
│  └─────────────────┘                                                           │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐                                                           │
│  │ Data Processing │ ◄─── Validation & Transformation                        │
│  │                 │ ◄─── Availability Processing                             │
│  │                 │ ◄─── Price Calculation                                    │
│  └─────────────────┘                                                           │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐                                                           │
│  │ Supabase        │ ◄─── PostgreSQL Database                                 │
│  │ Database        │ ◄─── Row Level Security                                  │
│  │                 │ ◄─── Real-time Subscriptions                              │
│  └─────────────────┘                                                           │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐                                                           │
│  │ Backend API     │ ◄─── Express.js + TSOA                                   │
│  │                 │ ◄─── Controllers & Services                               │
│  │                 │ ◄─── Authentication & Authorization                     │
│  └─────────────────┘                                                           │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐                                                           │
│  │ Frontend        │ ◄─── Next.js + React                                     │
│  │ Application     │ ◄─── Custom Hooks & State Management                     │
│  │                 │ ◄─── Component Architecture                              │
│  └─────────────────┘                                                           │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐                                                           │
│  │ User Interface  │ ◄─── Tailwind CSS + Shadcn/UI                          │
│  │                 │ ◄─── Responsive Design                                  │
│  │                 │ ◄─── Accessibility Features                              │
│  └─────────────────┘                                                           │
│                                                                                 │
│  Cron Jobs:                                                                     │
│  ├── Daily (0 0 * * *):                                                        │
│  │   ├── Process availability data                                             │
│  │   ├── Update pricing information                                            │
│  │   └── Generate free weeks calculation                                      │
│  └── Weekly (0 0 * * 0):                                                       │
│      ├── Sync boats from external API                                          │
│      ├── Update boat catalog                                                   │
│      └── Generate availability reports                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                SECURITY LAYERS                                 │
│                                                                                 │
│  Frontend Security:                                                             │
│  ├── Authentication:                                                           │
│  │   ├── JWT tokens in HTTP-only cookies                                       │
│  │   ├── Automatic token refresh                                               │
│  │   ├── Route protection with AuthGuard                                      │
│  │   └── Role-based access control                                             │
│  ├── Data Protection:                                                          │
│  │   ├── Input validation and sanitization                                    │
│  │   ├── XSS protection with React                                            │
│  │   ├── CSRF protection via Supabase                                         │
│  │   └── Secure API communication (HTTPS)                                     │
│  └── Error Handling:                                                          │
│      ├── Error message sanitization                                            │
│      ├── Error boundaries for component errors                                │
│      └── User-friendly error messages                                         │
│                                                                                 │
│  Backend Security:                                                             │
│  ├── API Security:                                                             │
│  │   ├── Helmet for security headers                                           │
│  │   ├── CORS configuration                                                    │
│  │   ├── Rate limiting middleware                                              │
│  │   ├── Input validation with Zod                                             │
│  │   └── SQL injection prevention                                              │
│  ├── Authentication:                                                          │
│  │   ├── Supabase Auth integration                                             │
│  │   ├── JWT token validation                                                  │
│  │   ├── Session management                                                    │
│  │   └── Role-based access control                                             │
│  └── Logging & Monitoring:                                                    │
│      ├── Google Cloud Logging                                                  │
│      ├── Structured logging                                                    │
│      ├── Error tracking                                                        │
│      └── Performance monitoring                                                │
│                                                                                 │
│  Database Security:                                                            │
│  ├── Row Level Security (RLS):                                                │
│  │   ├── Public read access for boats data                                    │
│  │   ├── User-specific access for profiles                                    │
│  │   └── Admin-only access for logs                                           │
│  ├── Connection Security:                                                     │
│  │   ├── Encrypted connections                                                 │
│  │   ├── Connection pooling                                                    │
│  │   └── Query optimization                                                    │
│  └── Data Protection:                                                         │
│      ├── Data encryption at rest                                               │
│      ├── Backup and recovery                                                   │
│      └── Audit logging                                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PERFORMANCE METRICS                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                PERFORMANCE DATA                                │
│                                                                                 │
│  Response Times:                                                                │
│  ├── Boat List: ~200-500ms                                                     │
│  ├── Boat Details: ~300-800ms                                                   │
│  ├── Dashboard: ~1-3s (due to external API calls)                             │
│  └── Search: ~100-300ms                                                        │
│                                                                                 │
│  Data Volume:                                                                   │
│  ├── Total Boats: ~942 boats                                                   │
│  ├── Availability Records: ~50,000 weekly records                             │
│  ├── Price History: ~100,000 price points                                     │
│  └── Database Size: ~50MB                                                     │
│                                                                                 │
│  Optimization Strategies:                                                       │
│  ├── Frontend:                                                                 │
│  │   ├── Code splitting and lazy loading                                      │
│  │   ├── Image optimization (WebP format)                                     │
│  │   ├── Caching with service workers                                         │
│  │   ├── Bundle optimization (tree shaking)                                   │
│  │   └── CDN integration for static assets                                     │
│  ├── Backend:                                                                  │
│  │   ├── Database indexing optimization                                       │
│  │   ├── Connection pooling                                                    │
│  │   ├── Response compression                                                 │
│  │   ├── Caching layer (Redis planned)                                        │
│  │   └── API versioning                                                        │
│  └── Database:                                                                 │
│      ├── Query optimization                                                    │
│      ├── Index optimization                                                   │
│      ├── Connection pooling                                                    │
│      └── Data archiving strategies                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

## Key Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Architecture**: Modular React components with TypeScript
- **State Management**: Custom hooks for data management
- **Authentication**: Secure JWT-based authentication
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Accessibility**: WCAG compliant with keyboard navigation

### Backend Features
- **RESTful API**: TSOA-generated API with Swagger documentation
- **Database Integration**: Supabase with PostgreSQL and RLS
- **External API Integration**: BoatAround API with fallback mechanisms
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Logging**: Google Cloud Logging with structured logs
- **Cron Jobs**: Automated data synchronization

### Testing Features
- **Unit Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright with Page Object Model
- **Coverage**: 80% threshold for all metrics
- **Mocking**: Comprehensive mock setup for external dependencies
- **CI/CD Ready**: Test scripts for automated testing

### Performance Features
- **Optimization**: Code splitting, lazy loading, and caching
- **Monitoring**: Performance metrics and error tracking
- **Scalability**: Connection pooling and database optimization
- **Reliability**: Fallback mechanisms and error recovery

## Technology Stack Summary

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Express.js, TypeScript, TSOA, Supabase, Zod
- **Database**: PostgreSQL (Supabase), Row Level Security
- **Testing**: Vitest, Playwright, React Testing Library
- **DevOps**: Lerna monorepo, Docker, Google Cloud
- **Security**: JWT, Helmet, CORS, Rate Limiting, Input Validation

This architecture provides a robust, scalable, and maintainable foundation for the Boats Stats application.
