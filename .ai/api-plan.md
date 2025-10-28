# REST API Plan

## 1. Resources

### Boats

- **Database Table**: `boats_list`
- **Description**: Main catalog of boats with metadata, pricing, and availability information
- **Key Fields**: slug, title, marina, country, region, coordinates, price, currency, reviewsScore

### Boat Availability

- **Database Table**: `boat_availability_{year}` (dynamic yearly tables)
- **Description**: Weekly availability and pricing data for each boat by year
- **Key Fields**: slug, week_1 through week_53, price history with timestamps

### Price History

- **Database Structure**: JSON objects within availability tables
- **Description**: Historical pricing data with timestamps for price tracking and analytics
- **Key Fields**: price, discount, createdAt timestamps

## 2. Endpoints

### Boats Resource

#### GET /boats

**Description**: Retrieve paginated list of boats with optional filtering

**Query Parameters**:

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `country` (string, optional): Filter by country (e.g., "croatia")
- `category` (string, optional): Filter by boat category (e.g., "catamaran")
- `region` (string, optional): Filter by region
- `min_price` (number, optional): Minimum price filter
- `max_price` (number, optional): Maximum price filter
- `sort` (string, optional): Sort field (price, reviewsScore, title)
- `order` (string, optional): Sort order (asc, desc)

**Response Payload**:

```json
{
  "data": [
    {
      "slug": "bali-41-avaler",
      "title": "Bali 41 Avaler",
      "marina": "Marina ACI",
      "country": "Croatia",
      "region": "Dalmatia",
      "city": "Split",
      "coordinates": [43.5081, 16.4402],
      "price": 5200,
      "currency": "EUR",
      "discount": 33,
      "reviewsScore": 4.8,
      "thumb": "https://example.com/thumb.jpg",
      "main_img": "https://example.com/main.jpg",
      "views": 1250
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20
  },
  "filters": {
    "countries": ["Croatia", "Greece"],
    "categories": ["catamaran", "sailboat"],
    "priceRange": {
      "min": 2000,
      "max": 15000
    }
  }
}
```

**Success Codes**: 200 OK
**Error Codes**: 400 Bad Request, 500 Internal Server Error

#### GET /boats/{slug}

**Description**: Retrieve detailed information for a specific boat

**Path Parameters**:

- `slug` (string, required): Unique boat identifier

**Response Payload**:

```json
{
  "slug": "bali-41-avaler",
  "title": "Bali 41 Avaler",
  "description": "Luxury catamaran with modern amenities",
  "marina": "Marina ACI",
  "country": "Croatia",
  "region": "Dalmatia",
  "city": "Split",
  "coordinates": [43.5081, 16.4402],
  "price": 5200,
  "currency": "EUR",
  "discount": 33,
  "reviewsScore": 4.8,
  "images": {
    "thumb": "https://example.com/thumb.jpg",
    "main": "https://example.com/main.jpg",
    "gallery": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
  },
  "specifications": {
    "length": 12.4,
    "berths": 8,
    "cabins": 4,
    "bathrooms": 3,
    "engine": "2x40HP",
    "year": 2020
  },
  "amenities": ["Air Conditioning", "WiFi", "GPS", "Autopilot"],
  "license": ["Skipper License Required"],
  "charter": "Bareboat",
  "views": 1250,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:22:00Z"
}
```

**Success Codes**: 200 OK
**Error Codes**: 404 Not Found, 400 Bad Request

### Availability Resource

#### GET /boats/{slug}/availability

**Description**: Get availability data for a specific boat

**Path Parameters**:

- `slug` (string, required): Unique boat identifier

**Query Parameters**:

- `year` (number, required): Year for availability data (current or future)
- `week` (number, optional): Specific week number (1-53)

**Response Payload**:

```json
{
  "slug": "bali-41-avaler",
  "year": 2025,
  "availability": {
    "week_1": {
      "available": true,
      "price": 5200,
      "discount": 33,
      "priceHistory": {
        "2025-01-15T10:30:00Z": {
          "price": 5200,
          "discount": 33,
          "createdAt": "2025-01-15T10:30:00Z"
        },
        "2025-01-20T14:22:00Z": {
          "price": 5199.99,
          "discount": 34,
          "createdAt": "2025-01-20T14:22:00Z"
        }
      }
    },
    "week_2": {
      "available": false,
      "price": null,
      "discount": null,
      "priceHistory": null
    }
  },
  "lastUpdated": "2025-01-20T14:22:00Z"
}
```

**Success Codes**: 200 OK
**Error Codes**: 404 Not Found, 400 Bad Request

#### GET /boats/{slug}/prices

**Description**: Get current pricing for a specific boat and time period

**Path Parameters**:

- `slug` (string, required): Unique boat identifier

**Query Parameters**:

- `year` (number, required): Year
- `week` (number, optional): Week number (1-53)
- `checkIn` (string, optional): Check-in date (YYYY-MM-DD)
- `checkOut` (string, optional): Check-out date (YYYY-MM-DD)

**Response Payload**:

```json
{
  "slug": "bali-41-avaler",
  "pricing": {
    "price": 5200,
    "discount": 33,
    "totalPrice": 5200,
    "currency": "EUR",
    "period": 7,
    "checkIn": "2025-01-18",
    "checkOut": "2025-01-25",
    "week": 3,
    "year": 2025,
    "lastUpdated": "2025-01-20T14:22:00Z"
  }
}
```

**Success Codes**: 200 OK
**Error Codes**: 404 Not Found, 400 Bad Request

### Search Resource

#### GET /boats/search

**Description**: Advanced search for boats with multiple filters

**Query Parameters**:

- `query` (string, optional): Search term for boat title or description
- `country` (string, optional): Country filter
- `region` (string, optional): Region filter
- `category` (string, optional): Boat category filter
- `min_price` (number, optional): Minimum price
- `max_price` (number, optional): Maximum price
- `min_reviews` (number, optional): Minimum review score
- `check_in` (string, optional): Desired check-in date (YYYY-MM-DD)
- `check_out` (string, optional): Desired check-out date (YYYY-MM-DD)
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page

**Response Payload**:

```json
{
  "results": [
    {
      "slug": "bali-41-avaler",
      "title": "Bali 41 Avaler",
      "country": "Croatia",
      "region": "Dalmatia",
      "price": 5200,
      "currency": "EUR",
      "discount": 33,
      "reviewsScore": 4.8,
      "available": true,
      "thumb": "https://example.com/thumb.jpg"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 95,
    "itemsPerPage": 20
  },
  "filters": {
    "applied": {
      "country": "Croatia",
      "min_price": 3000
    },
    "available": {
      "countries": ["Croatia", "Greece", "Turkey"],
      "regions": ["Dalmatia", "Istria", "Ionian"],
      "categories": ["catamaran", "sailboat", "motorboat"]
    }
  }
}
```

**Success Codes**: 200 OK
**Error Codes**: 400 Bad Request, 500 Internal Server Error

### Admin Resource

#### POST /admin/sync/weekly

**Description**: Trigger weekly boat data synchronization (Admin only)

**Authentication**: Required (Admin role)

**Request Payload**:

```json
{
  "country": "croatia",
  "category": "catamaran"
}
```

**Response Payload**:

```json
{
  "message": "Weekly sync initiated successfully",
  "jobId": "sync_weekly_20250120_143022",
  "estimatedDuration": "5-10 minutes",
  "startedAt": "2025-01-20T14:30:22Z"
}
```

**Success Codes**: 202 Accepted
**Error Codes**: 401 Unauthorized, 403 Forbidden, 500 Internal Server Error

#### POST /admin/sync/daily

**Description**: Trigger daily availability processing (Admin only)

**Authentication**: Required (Admin role)

**Request Payload**:

```json
{
  "endYear": 2026
}
```

**Response Payload**:

```json
{
  "message": "Daily processing initiated successfully",
  "jobId": "sync_daily_20250120_143022",
  "estimatedDuration": "15-30 minutes",
  "startedAt": "2025-01-20T14:30:22Z"
}
```

**Success Codes**: 202 Accepted
**Error Codes**: 401 Unauthorized, 403 Forbidden, 500 Internal Server Error

#### GET /admin/jobs/{jobId}/status

**Description**: Check status of background sync jobs (Admin only)

**Path Parameters**:

- `jobId` (string, required): Job identifier

**Authentication**: Required (Admin role)

**Response Payload**:

```json
{
  "jobId": "sync_weekly_20250120_143022",
  "status": "completed",
  "progress": 100,
  "startedAt": "2025-01-20T14:30:22Z",
  "completedAt": "2025-01-20T14:35:15Z",
  "duration": "4m 53s",
  "results": {
    "boatsProcessed": 150,
    "newBoats": 5,
    "updatedBoats": 145,
    "errors": 0
  }
}
```

**Success Codes**: 200 OK
**Error Codes**: 404 Not Found, 401 Unauthorized, 403 Forbidden

### Health Check

#### GET /health

**Description**: API health check endpoint

**Response Payload**:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T14:30:22Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "external_api": "connected",
    "cache": "connected"
  }
}
```

**Success Codes**: 200 OK
**Error Codes**: 503 Service Unavailable

## 3. Authentication and Authorization

### Authentication Mechanism

- **Type**: JWT (JSON Web Tokens) via Supabase Auth
- **Implementation**: Supabase Auth with `@supabase/ssr` package
- **Token Storage**: HTTP-only cookies for security
- **Token Refresh**: Automatic refresh handled by Supabase client

### Authorization Levels

1. **Public Access**:

   - GET /boats
   - GET /boats/{slug}
   - GET /boats/search
   - GET /boats/{slug}/availability
   - GET /boats/{slug}/prices
   - GET /health

2. **Authenticated Users**:

   - All public endpoints with enhanced rate limits
   - Access to user-specific data (future feature)

3. **Admin Users**:
   - All authenticated user permissions
   - POST /admin/sync/weekly
   - POST /admin/sync/daily
   - GET /admin/jobs/{jobId}/status
   - Access to admin dashboard endpoints

### Implementation Details

```typescript
// Middleware implementation
const PUBLIC_PATHS = ["/health", "/boats", "/boats/search"];
const ADMIN_PATHS = ["/admin"];

// Authentication check
const supabase = createSupabaseServerInstance({ cookies, headers });
const {
  data: { user },
} = await supabase.auth.getUser();

// Authorization check
if (ADMIN_PATHS.some((path) => url.pathname.startsWith(path))) {
  const {
    data: { user: adminUser },
  } = await supabase.auth.getUser();
  if (!adminUser || !adminUser.user_metadata?.is_admin) {
    return new Response(JSON.stringify({ error: "Admin access required" }), {
      status: 403,
    });
  }
}
```

## 4. Validation and Business Logic

### Resource Validation

#### Boats Validation

- **slug**: Required string, unique identifier, alphanumeric with hyphens
- **title**: Required string, max 200 characters
- **country**: Required string, must be valid country code
- **price**: Required number, positive value, max 2 decimal places
- **discount**: Optional number, 0-100 percentage
- **coordinates**: Required array of 2 numbers (latitude, longitude)
- **reviewsScore**: Optional number, 0-5 range

#### Availability Validation

- **year**: Required number, current or future year only
- **week**: Optional number, 1-53 range (ISO week numbers)
- **checkIn/checkOut**: Optional strings, ISO date format (YYYY-MM-DD)
- **price**: Positive number when available
- **discount**: 0-100 percentage when provided

#### Search Validation

- **page**: Optional number, minimum 1
- **limit**: Optional number, 1-100 range
- **min_price/max_price**: Optional numbers, positive values
- **check_in/check_out**: Optional strings, valid ISO dates, check_out > check_in

### Business Logic Implementation

#### Price Calculation

```typescript
// Calculate final price with discount
const finalPrice = basePrice - (basePrice * discount) / 100;
const totalPrice = finalPrice * period; // period in days
```

#### Availability Processing

```typescript
// Check if dates are available
const isAvailable = !reservations.some(
  (reservation) =>
    checkIn < reservation.checkOut && checkOut > reservation.checkIn
);

// Calculate free weeks in year
const freeWeeks = allWeekends.filter(
  (weekend) =>
    !reservations.some(
      (reservation) =>
        reservation.checkIn <= weekend.checkOut &&
        reservation.checkOut >= weekend.checkIn
    )
);
```

#### Data Synchronization

```typescript
// Weekly sync: Fetch all boats for country/category
const boats = await boatService.getBoats({ country, category });
await Promise.all(
  boats.map((boat) => supabaseService.upsertData("boats_list", boat))
);

// Daily processing: Update availability and pricing
const boats = await supabaseService.selectData("boats_list", "slug");
await processBoats(boats, endYear);
```

#### Rate Limiting

```typescript
// Implement rate limiting for external API calls
const API_REQUEST_PRICE_DELAY_MS = 1000; // 1 second between requests
await sleep(API_REQUEST_PRICE_DELAY_MS);
```

#### Error Handling

```typescript
// Comprehensive error handling
try {
  const result = await processBoatData(slug, week, year);
  return { data: result, error: null };
} catch (error) {
  logger.error(`Error processing boat ${slug}:`, error);
  return {
    data: null,
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    },
  };
}
```

### Data Consistency

- **Foreign Key Constraints**: Enforce referential integrity between boats and availability tables
- **Unique Constraints**: Ensure slug uniqueness across all boat records
- **Data Validation**: Server-side validation for all input parameters
- **Atomic Operations**: Use database transactions for multi-step operations
- **Audit Trail**: Maintain creation and update timestamps for all records
