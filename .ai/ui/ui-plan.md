<ui_architecture_planning>
Let me thoroughly analyze the PRD, API plan, and session notes to create a comprehensive UI architecture.

## Step 1: Analyzing the PRD

From the PRD, I can extract these key requirements:

- This is a yacht booking analytics application focused on data visualization and business insights
- Core functionalities include displaying booking data in tables and charts, interactive filtering, drill-down capabilities, and exportable reports
- User stories emphasize analytics dashboard, filtering by yacht type/date/promotion, drill-down analysis, and export functionality
- Security requirements include user authentication and role-based access control
- Success metrics focus on data accuracy, performance (2 seconds for 10k records), and error-free filtering/drilling

## Step 2: Analyzing the API Plan

Key API endpoints identified:

- GET /boats - paginated boat listing with extensive filtering
- GET /boats/{slug} - detailed boat information
- GET /boats/search - advanced search with multiple filters
- GET /boats/{slug}/availability - weekly availability data
- GET /boats/{slug}/prices - pricing information with date ranges
- POST /admin/sync/weekly and /admin/sync/daily - admin sync operations
- GET /admin/jobs/{jobId}/status - job monitoring
- Authentication via Supabase Auth with role-based access

## Step 3: Identifying Necessary Views

Based on the analysis, I need these main views:

1. Authentication/Login View
2. Analytics Dashboard (primary view)
3. Boat Listing/Search View
4. Boat Detail View
5. Admin Dashboard
6. Admin Sync Management
7. Reports/Export View
8. Error/Not Found Views

## Step 4: User Journey Mapping

Main user journey:

1. User authenticates → Analytics Dashboard
2. User applies filters → Data updates in real-time
3. User drills down from charts/tables → Boat detail view
4. User exports filtered data → Reports view
5. Admin users access sync management → Admin dashboard

## Step 5: Navigation Structure

- Primary: Analytics Dashboard (main entry point)
- Secondary: Boat browsing and search
- Admin: Role-based admin sections
- Global: Authentication, settings, help

## Step 6: Key Components

- Filter panels with progressive disclosure
- Interactive charts and tables with drill-down
- Modal overlays for boat details
- Export functionality
- Role-based UI components
- Error boundaries and loading states
  </ui_architecture_planning>

```markdown
# UI Architecture for Yacht Booking Analytics

## 1. UI Structure Overview

The user interface is designed as an analytics-focused application with the dashboard as the primary interface. The architecture prioritizes data visualization and business insights while providing comprehensive filtering and drill-down capabilities. The design follows a role-based approach, with admin functionality seamlessly integrated into the main application flow.

## 2. View List

### 2.1 Authentication View

- **View Path**: `/login`
- **Main Purpose**: Secure user authentication and role verification
- **Key Information**: Login form, role-based redirect logic
- **Key View Components**: Login form, password reset, role selection
- **UX/Accessibility/Security**: Form validation, keyboard navigation, secure token handling, rate limiting feedback

### 2.2 Analytics Dashboard

- **View Path**: `/dashboard`
- **Main Purpose**: Primary interface for data visualization and business insights
- **Key Information**: Booking trends, yacht popularity, promotion effectiveness, availability patterns
- **Key View Components**: Interactive charts, data tables, filter panels, export controls, refresh indicators
- **UX/Accessibility/Security**: Responsive design, screen reader support, role-based data access, real-time updates

### 2.3 Boat Listing View

- **View Path**: `/boats`
- **Main Purpose**: Browse and search boats with comprehensive filtering
- **Key Information**: Boat cards with images, pricing, availability, ratings, location
- **Key View Components**: Search bar, filter sidebar, boat cards, pagination, view toggle (grid/list)
- **UX/Accessibility/Security**: Progressive disclosure filters, keyboard navigation, image alt text, secure data display

### 2.4 Boat Detail View

- **View Path**: `/boats/{slug}`
- **Main Purpose**: Detailed boat information with availability calendar and price history
- **Key Information**: Specifications, amenities, availability calendar, price trends, images
- **Key View Components**: Image gallery, availability calendar, price history charts, specifications table
- **UX/Accessibility/Security**: Modal overlay integration, interactive calendar, chart accessibility, secure data visualization

### 2.5 Advanced Search View

- **View Path**: `/search`
- **Main Purpose**: Advanced filtering and search capabilities
- **Key Information**: Multi-criteria search results with availability checking
- **Key View Components**: Advanced search form, results grid, availability indicators, date pickers
- **UX/Accessibility/Security**: Form validation, clear search criteria, secure search parameters, result caching

### 2.6 Admin Dashboard

- **View Path**: `/admin` (admin only)
- **Main Purpose**: System management and monitoring for admin users
- **Key Information**: Sync job status, system health, data processing metrics
- **Key View Components**: Job status cards, sync triggers, system metrics, error logs
- **UX/Accessibility/Security**: Role-based access control, secure admin actions, audit trail display

### 2.7 Sync Management View

- **View Path**: `/admin/sync` (admin only)
- **Main Purpose**: Manage data synchronization operations
- **Key Information**: Job progress, estimated completion times, error handling
- **Key View Components**: Progress bars, job controls, status indicators, error messages
- **UX/Accessibility/Security**: Real-time updates, secure job management, role verification

### 2.8 Reports Export View

- **View Path**: `/reports`
- **Main Purpose**: Generate and export filtered reports in various formats
- **Key Information**: Export options, filtered data preview, format selection
- **Key View Components**: Export controls, data preview, format selectors, download buttons
- **UX/Accessibility/Security**: Secure data export, format validation, user feedback

### 2.9 Error Views

- **View Path**: `/error`, `/404`
- **Main Purpose**: Handle application errors and missing resources
- **Key Information**: Error messages, recovery options, navigation back to main views
- **Key View Components**: Error messages, retry buttons, navigation links
- **UX/Accessibility/Security**: Clear error communication, recovery options, secure error handling

## 3. User Journey Map

### 3.1 Primary Analytics Journey

1. **Authentication** → User logs in and is redirected based on role
2. **Dashboard Entry** → User lands on analytics dashboard with default filters
3. **Data Exploration** → User applies filters (date range, yacht type, promotion)
4. **Drill-Down Analysis** → User clicks on chart/table elements to view detailed data
5. **Boat Detail Review** → User accesses individual boat information via modal or navigation
6. **Export Actions** → User exports filtered data for business decisions

### 3.2 Secondary Browsing Journey

1. **Boat Search** → User navigates to boat listing from dashboard
2. **Filter Application** → User applies search criteria and availability filters
3. **Boat Comparison** → User reviews multiple boats with detailed information
4. **Availability Check** → User checks specific dates and pricing
5. **Return to Analytics** → User returns to dashboard with new insights

### 3.3 Admin Management Journey

1. **Admin Access** → Admin user accesses admin dashboard
2. **Sync Monitoring** → Admin reviews sync job status and system health
3. **Sync Operations** → Admin triggers weekly/daily sync operations
4. **Job Management** → Admin monitors job progress and handles errors
5. **System Maintenance** → Admin performs system maintenance tasks

## 4. Layout and Navigation Structure

### 4.1 Primary Navigation

- **Top Navigation Bar**: Logo, main navigation (Dashboard, Boats, Search), user menu, admin menu (role-based)
- **Sidebar Navigation**: Filter panels, quick access tools, export options
- **Breadcrumb Navigation**: Context-aware navigation for deep drill-downs

### 4.2 Navigation Hierarchy
```

Dashboard (Primary)
├── Analytics Overview
├── Filter Management
├── Export Tools
└── Admin Section (Role-based)
├── Sync Management
├── Job Monitoring
└── System Health

Boats (Secondary)
├── Boat Listing
├── Advanced Search
├── Boat Details
└── Availability Calendar

Reports (Secondary)
├── Export Options
├── Data Preview
└── Download Management

```

### 4.3 Mobile Navigation
- **Bottom Tab Navigation**: Dashboard, Boats, Search, Profile
- **Collapsible Sidebar**: Filter options and tools
- **Modal Overlays**: Boat details and admin functions

## 5. Key Components

### 5.1 Data Visualization Components
- **Interactive Charts**: Line charts for trends, bar charts for comparisons, pie charts for distributions
- **Data Tables**: Sortable, filterable tables with drill-down capabilities
- **Calendar Views**: Availability calendars with price indicators
- **Progress Indicators**: Real-time sync job progress and system status

### 5.2 Filter and Search Components
- **Progressive Filter Panel**: Collapsible sections with essential and advanced filters
- **Date Range Pickers**: Flexible date selection for temporal analysis
- **Multi-Select Dropdowns**: Category, region, and promotion filters
- **Search Bar**: Global search with autocomplete and suggestions

### 5.3 Navigation and Layout Components
- **Role-Based Navigation**: Dynamic navigation based on user permissions
- **Breadcrumb Navigation**: Context-aware navigation for deep analysis
- **Modal Overlays**: Boat details and admin functions without losing context
- **Responsive Grid**: Adaptive layout for different screen sizes

### 5.4 Export and Reporting Components
- **Export Controls**: Format selection and download management
- **Data Preview**: Filtered data preview before export
- **Report Templates**: Predefined report formats for common use cases
- **Download Management**: Track and manage exported files

### 5.5 Error Handling and Loading Components
- **Error Boundaries**: Comprehensive error handling with recovery options
- **Loading Skeletons**: Placeholder content during data loading
- **Retry Mechanisms**: Automatic and manual retry options for failed operations
- **Status Indicators**: Real-time status updates for background operations
```
