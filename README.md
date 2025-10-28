# BoatsStats

A comprehensive boat data management and analytics platform built with a modern tech stack, featuring automated data collection, API endpoints, and real-time boat information processing.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## 🚢 Project Description

BoatsStats is a monorepo application designed to collect, process, and serve boat-related data through automated systems and RESTful APIs. The platform features:

- **Automated Data Collection**: Cron jobs for regular boat data updates
- **Price History Tracking**: Weekly and daily price monitoring
- **RESTful API**: TSOA-generated endpoints with Swagger documentation
- **Database Integration**: Supabase-powered backend services
- **Modern Frontend**: Next.js-based frontend with React components

## 🛠 Tech Stack

### Frontend

- **Next.js 14** - React framework with server-side rendering
- **React 18** - Interactive component library
- **TypeScript** - Static typing and enhanced IDE support
- **Tailwind CSS** - Utility-first styling framework
- **Shadcn/ui** - Accessible React component library

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **TSOA** - OpenAPI specification generator
- **Supabase** - PostgreSQL database and Backend-as-a-Service

### Infrastructure & Tools

- **Lerna** - Monorepo management
- **Docker** - Containerization
- **Google Cloud Logging** - Logging service
- **OpenRouter.ai** - AI model communication
- **GitHub Actions** - CI/CD pipelines
- **DigitalOcean** - Cloud hosting platform

### Testing

- **Jest** - Backend unit testing framework
- **Vitest** - Frontend unit testing framework
- **React Testing Library** - React component testing utilities
- **Playwright** - End-to-end testing framework
- **Supertest** - API integration testing
- **Artillery.js** - Performance and load testing

## 🚀 Getting Started Locally

### Prerequisites

- Node.js 22.x
- npm or yarn
- Docker (optional)
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd boatsStats
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy environment template (create based on your needs)
   cp packages/backend/.env.example packages/backend/.env
   # Add your Supabase credentials and other configuration
   ```

4. **Start the backend development server**

   ```bash
   cd packages/backend
   npm run start
   ```

5. **Access the application**
   - API: `http://localhost:8080`
   - API Documentation: `http://localhost:8080/api-docs`

## 📜 Available Scripts

### Root Level

```bash
# Install dependencies for all packages
npm install

# Run tests for all packages
npm test
```

### Backend Package

```bash
# Development
npm run start              # Start development server with ts-node
npm run start-local        # Start production build locally

# Building
npm run build              # Build TypeScript and generate TSOA routes
npm run gcp-build          # Build for Google Cloud Platform

# API Documentation
npm run tsoa:spec          # Generate OpenAPI specification
npm run tsoa:routes        # Generate TSOA routes

# Code Quality
npm run prettier:fix       # Fix code formatting
npm run lint:fix           # Fix linting issues

# Testing
npm test                   # Run backend tests
npm run test:unit         # Run unit tests with Jest
npm run test:integration  # Run integration tests
npm run test:coverage     # Run tests with coverage report
```

### Frontend Package

```bash
npm test                   # Run frontend tests
npm run test:unit          # Run unit tests with Vitest
npm run test:e2e          # Run end-to-end tests with Playwright
npm run test:coverage     # Run tests with coverage report
```

## 📁 Project Structure

```
boatsStats/
├── packages/
│   ├── backend/           # Node.js API server
│   │   ├── src/
│   │   │   ├── api/       # Express app setup
│   │   │   ├── controllers/ # TSOA controllers
│   │   │   ├── services/  # Business logic services
│   │   │   ├── types/     # TypeScript type definitions
│   │   │   ├── utils/     # Utility functions
│   │   │   └── routes/    # Route definitions
│   │   ├── dist/          # Compiled JavaScript
│   │   ├── Dockerfile     # Docker configuration
│   │   └── package.json
│   └── frontend/          # Frontend application (Next.js + React)
├── lerna.json             # Lerna monorepo configuration
└── package.json           # Root package configuration
```

## 📚 API Documentation

The API documentation is automatically generated using TSOA and Swagger UI. Once the backend is running, you can access:

- **Interactive API Docs**: `http://localhost:8080/api-docs`
- **OpenAPI Specification**: Generated via `npm run tsoa:spec`

### API Overview

The BoatsStats API provides **53+ documented endpoints** across 4 main categories:

#### Authentication Endpoints

- POST `/auth/login` - User login
- POST `/auth/register` - User registration
- POST `/auth/forgot-password` - Password reset request
- POST `/auth/reset-password` - Password reset confirmation
- POST `/auth/logout` - User logout
- POST `/auth/profile` - Update user profile

#### Boats Endpoints

- GET `/boat` - Get boat data by slug and week
- GET `/boat/list` - Paginated boats list with filtering
- GET `/boat/search` - Search boats by query
- GET `/boat/details/{slug}` - Get complete boat details
- GET `/boat/availability/{slug}` - Get boat availability data
- GET `/boat/health` - Health check endpoint

#### Dashboard Endpoints

- GET `/dashboard/summary` - Dashboard summary metrics
- GET `/dashboard/metrics` - Key performance indicators
- GET `/dashboard/price-trends` - Weekly price analysis
- GET `/dashboard/discount-trends` - Discount tracking
- GET `/dashboard/availability` - Availability trends
- GET `/dashboard/revenue` - Revenue analytics
- GET `/dashboard/stats` - Statistical insights

#### Admin Endpoints

- GET `/admin/users` - User management
- GET `/admin/logs/*` - Various log endpoints
- GET/POST `/admin/notes` - Notes management

### Example Request

```bash
# Get boat details
curl http://localhost:8080/boat?slug=bali-41-avaler&year=2025&week=1

# Get dashboard summary
curl http://localhost:8080/dashboard/summary?boat_type=catamaran
```

## 🎯 Project Scope

### Current Features

#### Backend

- ✅ Automated boat data collection via cron jobs
- ✅ RESTful API with TypeScript support
- ✅ Supabase database integration
- ✅ Professional Swagger API documentation (53+ endpoints)
- ✅ Docker containerization
- ✅ Monorepo structure with Lerna
- ✅ Google Cloud Logging integration
- ✅ User authentication and authorization
- ✅ Admin panel with user management
- ✅ System logs monitoring

#### Frontend

- ✅ Complete Next.js application with React
- ✅ User authentication (Login, Register, Password Reset)
- ✅ Interactive dashboard with analytics
- ✅ Boat listing and detail pages
- ✅ Admin panel
- ✅ User settings and profile management
- ✅ Mobile-responsive UI with Tailwind CSS
- ✅ 79+ React components
- ✅ 14 custom hooks

#### Testing

- ✅ Comprehensive unit tests (Vitest)
- ✅ End-to-end tests (Playwright)
- ✅ Test coverage reporting
- ✅ Page Object Model for E2E tests

#### CI/CD

- ✅ GitHub Actions workflows
- ✅ Docker image building
- ✅ Security scanning with Trivy
- ✅ Automated testing pipeline

### Planned Enhancements

- 🚧 Real-time data updates with WebSockets
- 🚧 Advanced analytics and visualizations
- 🚧 Mobile application
- 🚧 Advanced reporting features

## 📊 Project Status

**Current Status**: Production Ready

- **Backend**: ✅ Fully functional with 53+ API endpoints
- **Database**: ✅ Connected to Supabase with RLS
- **API Documentation**: ✅ Professional Swagger UI
- **Frontend**: ✅ Complete with all core features
- **Authentication**: ✅ Full auth system implemented
- **Admin Panel**: ✅ User and system management
- **Testing**: ✅ Unit and E2E tests in place
- **CI/CD**: ✅ GitHub Actions fully configured
- **Deployment**: ✅ Docker configuration ready

### Production Features

1. ✅ Full-stack application with authentication
2. ✅ Comprehensive API with Swagger documentation
3. ✅ Advanced analytics and dashboard
4. ✅ Complete testing suite (Unit, Integration, E2E)
5. ✅ CI/CD pipelines with quality gates
6. ✅ Ready for production deployment

### Next Steps

1. Deploy to production environment
2. Add real-time notifications
3. Expand analytics capabilities
4. Optimize performance

## 📄 License

ISC License - see individual package.json files for details.

---

**Built with ❤️ using modern web technologies**
