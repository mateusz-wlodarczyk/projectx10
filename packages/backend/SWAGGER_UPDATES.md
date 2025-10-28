# Swagger API Documentation Updates

## Summary

Updated Swagger API documentation to provide comprehensive and professional documentation for the BoatsStats API project, meeting quality requirements for the certification project.

## Changes Made

### 1. Enhanced API Metadata

Updated `tsoa.json` configuration to include professional API information:

**Before:**

- Title: "backend"
- Version: "0.0.0"
- Description: Hamilton lyrics (inappropriate)
- No contact information

**After:**

- Title: "BoatsStats API"
- Version: "1.0.0"
- Description: "Comprehensive yacht booking analytics API with boat data management, authentication, dashboard metrics, and admin functionality."
- Contact: Added support name and email

### 2. API Tags with Descriptions

Added detailed descriptions for all API endpoint groups:

- **Authentication**: User authentication and registration endpoints
- **Boats**: Boat data, search, and availability endpoints
- **Dashboard**: Analytics and dashboard metrics endpoints
- **Admin**: Administrative endpoints for user management and system monitoring

### 3. Generated Documentation

The updated Swagger specification includes:

- **53+ documented endpoints** across 4 main categories
- Comprehensive request/response schemas
- Parameter documentation with descriptions
- Error response definitions
- Data model schemas

## Endpoint Categories

### Authentication Endpoints

- POST `/auth/login` - User login
- POST `/auth/register` - User registration
- POST `/auth/forgot-password` - Password reset request
- POST `/auth/reset-password` - Password reset confirmation
- POST `/auth/logout` - User logout
- POST `/auth/profile` - Update user profile

### Boats Endpoints

- GET `/boat` - Get boat data by slug and week
- GET `/boat/list` - Paginated boats list with filtering
- GET `/boat/search` - Search boats by query
- GET `/boat/search/{boatId}` - Search specific boat by ID
- GET `/boat/details/{slug}` - Get complete boat details
- GET `/boat/availability/{slug}` - Get boat availability data
- GET `/boat/availability/{slug}/week/{week}` - Get week-specific data
- GET `/boat/health` - Health check endpoint

### Dashboard Endpoints

- GET `/dashboard/summary` - Dashboard summary with key metrics
- GET `/dashboard/metrics` - Key performance indicators
- GET `/dashboard/price-trends` - Weekly price analysis
- GET `/dashboard/discount-trends` - Discount tracking
- GET `/dashboard/availability` - Availability trends
- GET `/dashboard/revenue` - Revenue analytics
- GET `/dashboard/stats` - Statistical data and insights
- GET `/dashboard/health` - Health check endpoint

### Admin Endpoints

- GET/POST `/admin/users` - User management
- PUT/DELETE `/admin/users/{id}` - User operations
- GET `/admin/logs/cron` - Cron job logs
- GET `/admin/logs/system` - System logs
- GET `/admin/logs/all` - All Supabase logs
- GET `/admin/logs/edge` - Edge function logs
- GET `/admin/logs/postgres` - PostgreSQL logs
- GET `/admin/logs/postgrest` - PostgREST logs
- GET `/admin/logs/pooler` - Connection pooler logs
- GET `/admin/logs/auth` - Authentication logs
- GET `/admin/logs/storage` - Storage logs
- GET `/admin/logs/realtime` - Realtime logs
- GET `/admin/logs/edge-functions` - Edge functions logs
- GET `/admin/logs/pgcron` - pgCron logs
- GET `/admin/cron/jobs` - Cron jobs list
- GET/POST `/admin/notes` - Notes management
- PUT/DELETE `/admin/notes/{id}` - Notes operations

## Data Models

The API includes comprehensive type definitions for:

- **AuthResponse** - Authentication response with user and session data
- **DashboardSummary** - Summary metrics for dashboard
- **DashboardMetricsResponse** - Key metrics with trends
- **PriceTrendsResponse** - Weekly price trends
- **DiscountTrendsResponse** - Discount analysis
- **AvailabilityResponse** - Availability insights
- **RevenueResponse** - Revenue analytics with projections
- **DashboardStatsResponse** - Statistical insights
- And many more...

## Usage

### Accessing Swagger UI

1. Start the backend server:

   ```bash
   cd packages/backend
   npm run start
   ```

2. Access Swagger UI at:
   ```
   http://localhost:8080/api-docs
   ```

### Regenerating Documentation

To regenerate the Swagger documentation after changes:

```bash
cd packages/backend
npm run tsoa:spec    # Generate OpenAPI specification
npm run tsoa:routes  # Generate route handlers
```

Or use the build command which does both:

```bash
npm run build
```

## Benefits

1. **Professional Documentation**: Meets quality standards for certification project
2. **Comprehensive Coverage**: All endpoints properly documented
3. **Developer Experience**: Easy to understand API structure and usage
4. **Quality Assurance**: Validated request/response structures
5. **Integration Ready**: Clear documentation for frontend integration

## Related Files

- `tsoa.json` - TSOA configuration and API metadata
- `src/swagger/swagger.json` - Generated OpenAPI 3.0 specification
- `src/controllers/` - Controllers with TSOA decorators
- `src/routes/routes.ts` - Auto-generated route handlers
