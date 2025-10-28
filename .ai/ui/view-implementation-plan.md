# API Endpoint Implementation Plan: GET /boats/{slug}/availability

## 1. Endpoint Overview

This endpoint retrieves availability data for a specific boat, including weekly availability status, pricing information, and price history. The endpoint provides both current and historical pricing data for boat charters, enabling users to make informed decisions about booking availability and pricing trends.

**Purpose**: Fetch comprehensive availability and pricing data for boat charters
**Authentication**: Public access (no authentication required)
**Rate Limiting**: Standard rate limiting applied for public endpoints

## 2. Request Details

- **HTTP Method**: GET
- **URL Structure**: `/boats/{slug}/availability`
- **Parameters**:
  - **Required**:
    - `slug` (path parameter): Unique boat identifier (string, alphanumeric with hyphens)
    - `year` (query parameter): Year for availability data (number, current or future year)
  - **Optional**:
    - `week` (query parameter): Specific week number (number, 1-53 ISO week format)
- **Request Body**: None (GET request)

**Example Request**:

```
GET /boats/bali-41-avaler/availability?year=2025&week=1
```

## 3. Used Types

### Request DTOs

- `BoatAvailabilityRequestDto`: Request validation structure
- `BoatAvailabilityQueryDto`: Query parameter validation

### Response DTOs

- `BoatAvailabilityDto`: Complete response structure
- `WeekAvailabilityDto`: Individual week data structure
- `PriceHistoryDto`: Price history with timestamps

### Database Entities

- `WeekData`: Database entity from boat*availability*{year} tables
- `BoatPrice`: Price entry structure with timestamps
- `BaseAvailabilityEntity`: Base availability data structure

### Error Types

- `ErrorDto`: Standardized error response
- `ValidationErrorDto`: Input validation errors

## 4. Response Details

### Success Response (200 OK)

```json
{
  "data": {
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
  },
  "error": null
}
```

### Error Responses

- **400 Bad Request**: Invalid parameters
- **404 Not Found**: Boat or availability data not found
- **500 Internal Server Error**: Database or server errors

## 5. Data Flow

1. **Request Validation**: Validate slug format, year range, and optional week parameter
2. **Boat Existence Check**: Verify boat exists in boats_list table
3. **Availability Table Query**: Query boat*availability*{year} table for the specified boat
4. **Data Transformation**: Transform database WeekData to BoatAvailabilityDto
5. **Price History Processing**: Extract and format price history from JSONB columns
6. **Response Assembly**: Construct final response with availability data
7. **Error Handling**: Handle validation and database errors appropriately

**Database Interactions**:

- `boats_list` table: Verify boat existence
- `boat_availability_{year}` table: Fetch weekly availability and pricing data
- JSONB columns: Extract price history and availability status

## 6. Security Considerations

### Authentication & Authorization

- **Public Access**: No authentication required for boat availability data
- **Rate Limiting**: Implement standard rate limiting (100 requests/minute per IP)
- **Input Sanitization**: Sanitize slug parameter to prevent injection attacks

### Data Protection

- **Parameterized Queries**: Use Supabase client parameterized queries to prevent SQL injection
- **Input Validation**: Strict validation of all input parameters
- **Error Information**: Limit error details in production to prevent information disclosure

### Monitoring

- **Access Logging**: Log all requests for monitoring and analytics
- **Error Tracking**: Track validation and database errors for system health monitoring
- **Performance Monitoring**: Monitor response times and database query performance

## 7. Error Handling

### Validation Errors (400 Bad Request)

```json
{
  "error": {
    "message": "Invalid input parameters",
    "code": "VALIDATION_ERROR",
    "details": {
      "slug": "Invalid slug format",
      "year": "Year must be current or future year",
      "week": "Week must be between 1 and 53"
    },
    "timestamp": "2025-01-20T14:30:22Z"
  }
}
```

### Not Found Errors (404 Not Found)

```json
{
  "error": {
    "message": "Boat or availability data not found",
    "code": "NOT_FOUND",
    "details": "No availability data found for boat 'bali-41-avaler' in year 2025",
    "timestamp": "2025-01-20T14:30:22Z"
  }
}
```

### Server Errors (500 Internal Server Error)

```json
{
  "error": {
    "message": "Internal server error",
    "code": "INTERNAL_ERROR",
    "details": "Database connection failed",
    "timestamp": "2025-01-20T14:30:22Z"
  }
}
```

## 8. Performance Considerations

### Database Optimization

- **Indexing**: Use composite indexes on (slug, year) for boat_availability tables
- **Query Optimization**: Limit data retrieval to required weeks only
- **Connection Pooling**: Utilize Supabase connection pooling for database operations

### Caching Strategy

- **Response Caching**: Cache availability data for 5 minutes to reduce database load
- **Cache Key**: `boat_availability:{slug}:{year}:{week?}`
- **Cache Invalidation**: Invalidate cache when availability data is updated

### Performance Monitoring

- **Response Time**: Target < 200ms for availability queries
- **Database Metrics**: Monitor query execution time and connection usage
- **Error Rates**: Track 4xx and 5xx error rates for system health

## 9. Implementation Steps

1. **Create Request Validation Service**

   - Implement `BoatAvailabilityRequestDto` validation
   - Add slug format validation (alphanumeric with hyphens)
   - Validate year (current or future) and week (1-53) parameters

2. **Extend SupabaseService**

   - Add method to query boat existence in boats_list table
   - Add method to fetch availability data from boat*availability*{year} tables
   - Implement error handling for database operations

3. **Create BoatAvailabilityService**

   - Implement availability data transformation logic
   - Add price history processing from JSONB columns
   - Handle week filtering and data aggregation

4. **Create TSOA Controller Method**

   - Add GET endpoint for `/boats/{slug}/availability`
   - Implement proper parameter binding and validation
   - Add OpenAPI documentation with examples

5. **Implement Error Handling**

   - Add comprehensive error handling for all failure scenarios
   - Implement proper HTTP status codes and error responses
   - Add logging for monitoring and debugging

6. **Add Response Transformation**

   - Transform WeekData to BoatAvailabilityDto
   - Process price history from database JSONB format
   - Add lastUpdated timestamp from database metadata

7. **Implement Caching**

   - Add Redis caching for availability responses
   - Implement cache invalidation strategy
   - Add cache hit/miss monitoring

8. **Add Monitoring and Logging**

   - Implement request/response logging
   - Add performance metrics collection
   - Set up error tracking and alerting

9. **Write Unit Tests**

   - Test validation logic for all input parameters
   - Test database service methods with mock data
   - Test error handling scenarios and response codes

10. **Integration Testing**

    - Test complete request/response flow
    - Verify database integration with real data
    - Test error scenarios and edge cases

11. **Performance Testing**

    - Load test with multiple concurrent requests
    - Verify response time targets (< 200ms)
    - Test database query performance under load

12. **Documentation**
    - Update API documentation with endpoint details
    - Add request/response examples
    - Document error codes and troubleshooting guide

