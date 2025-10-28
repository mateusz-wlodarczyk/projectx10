# Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. External API Connection Issues

#### Problem: BoatAround API Timeouts
```typescript
// Error messages
- "upstream connect error or disconnect/reset before headers"
- "502 Bad Gateway" from Cloudflare
- "Connection timed out"
- "Network connection lost"
```

#### Solutions:
```typescript
// 1. Check API status
curl -I https://api.boataround.com/v1/search

// 2. Verify rate limiting
- Current delay: 24 seconds between requests
- Reduce concurrent requests
- Implement exponential backoff

// 3. Use fallback data
- App automatically falls back to mock data
- Check Supabase database for cached data
- Verify boats_list table has data
```

#### Prevention:
```typescript
// Implement robust error handling
try {
  const data = await fetchExternalAPI();
  return { data, error: null };
} catch (error) {
  console.warn('External API failed, using fallback');
  return { data: mockData, error: null };
}
```

### 2. Dashboard Loading Issues

#### Problem: Dashboard Takes Too Long to Load
```typescript
// Symptoms
- Loading state shows for 10+ seconds
- Charts don't render
- User sees "Loading..." indefinitely
```

#### Solutions:
```typescript
// 1. Check backend health
curl http://localhost:8080/dashboard/health

// 2. Verify API endpoints
curl http://localhost:8080/dashboard/summary?boat_type=catamaran

// 3. Check browser network tab
- Look for failed requests
- Check response times
- Verify CORS headers

// 4. Add timeout handling
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);
```

#### Prevention:
```typescript
// Implement progressive loading
- Load basic data first
- Load charts in background
- Show skeleton screens
- Add retry mechanisms
```

### 3. Authentication Issues

#### Problem: Login/Logout Not Working
```typescript
// Symptoms
- Users can't log in
- Sessions expire unexpectedly
- Redirect loops
- "Unauthorized" errors
```

#### Solutions:
```typescript
// 1. Check Supabase configuration
- Verify SUPABASE_URL and SUPABASE_ANON_KEY
- Check RLS policies
- Verify user table exists

// 2. Clear browser data
localStorage.clear();
sessionStorage.clear();
// Clear cookies

// 3. Check authentication flow
- Verify AuthProvider is wrapping app
- Check AuthGuard implementation
- Verify protected routes
```

#### Prevention:
```typescript
// Implement proper error handling
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
} catch (error) {
  console.error('Auth error:', error);
  // Show user-friendly message
}
```

### 4. Database Connection Issues

#### Problem: Supabase Connection Failures
```typescript
// Error messages
- "522: Connection timed out"
- "Database connection failed"
- "Row Level Security policy violation"
```

#### Solutions:
```typescript
// 1. Check Supabase status
- Visit https://status.supabase.com
- Check your project dashboard
- Verify API keys

// 2. Test database connection
const { data, error } = await supabase
  .from('boats_list')
  .select('count')
  .limit(1);

// 3. Check RLS policies
- Verify policies are correctly configured
- Test with different user roles
- Check policy conditions
```

#### Prevention:
```typescript
// Implement connection pooling
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

### 5. Frontend Performance Issues

#### Problem: Slow Page Loads
```typescript
// Symptoms
- Pages take 5+ seconds to load
- Components render slowly
- Memory usage high
- Browser becomes unresponsive
```

#### Solutions:
```typescript
// 1. Check bundle size
npm run build
// Look for large chunks

// 2. Implement code splitting
const LazyComponent = lazy(() => import('./HeavyComponent'));

// 3. Optimize images
- Use WebP format
- Implement lazy loading
- Add proper alt text

// 4. Check for memory leaks
- Use React DevTools Profiler
- Check for uncleaned event listeners
- Verify useEffect cleanup
```

#### Prevention:
```typescript
// Implement performance monitoring
const startTime = performance.now();
// ... component logic
const endTime = performance.now();
console.log(`Component render time: ${endTime - startTime}ms`);
```

### 6. CORS Issues

#### Problem: CORS Errors in Browser
```typescript
// Error messages
- "Access to fetch at 'http://localhost:8080' has been blocked by CORS policy"
- "No 'Access-Control-Allow-Origin' header"
```

#### Solutions:
```typescript
// 1. Check backend CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// 2. Verify frontend API calls
- Use correct base URL
- Check request headers
- Verify credentials

// 3. Test with curl
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:8080/boats
```

## 🔧 Development Tools

### Debugging Commands
```bash
# Check backend health
curl http://localhost:8080/dashboard/health

# Test API endpoints
curl http://localhost:8080/boat/list?page=1&limit=5

# Check database connection
curl http://localhost:8080/admin/logs

# Monitor logs
tail -f packages/backend/logs/app.log
```

### Browser DevTools
```typescript
// Network tab
- Check for failed requests
- Monitor response times
- Verify request/response headers

// Console tab
- Look for JavaScript errors
- Check for API errors
- Monitor performance warnings

// Application tab
- Check localStorage/sessionStorage
- Verify cookies
- Check service workers
```

### Database Debugging
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check connection count
SELECT count(*) FROM pg_stat_activity;
```

## 📊 Monitoring and Alerts

### Key Metrics to Monitor
```typescript
// Application metrics
- API response times
- Error rates
- Database connection count
- Memory usage
- CPU usage

// Business metrics
- Active users
- Page views
- API requests per minute
- Data sync success rate
- User authentication success rate
```

### Alert Thresholds
```typescript
// Performance alerts
- API response time > 5 seconds
- Error rate > 5%
- Database connections > 80%
- Memory usage > 90%

// Business alerts
- Failed logins > 10%
- Data sync failures > 20%
- External API failures > 50%
```

## 🚀 Performance Optimization

### Backend Optimizations
```typescript
// 1. Database query optimization
- Add proper indexes
- Use connection pooling
- Implement query caching
- Optimize N+1 queries

// 2. API optimization
- Implement response caching
- Use compression
- Add rate limiting
- Optimize JSON responses
```

### Frontend Optimizations
```typescript
// 1. Bundle optimization
- Code splitting
- Tree shaking
- Lazy loading
- Image optimization

// 2. Runtime optimization
- Memoization
- Virtual scrolling
- Debounced search
- Optimistic updates
```

## 📝 Logging and Debugging

### Structured Logging
```typescript
// Backend logging
logger.info('User login attempt', {
  email: user.email,
  ip: req.ip,
  userAgent: req.get('User-Agent')
});

logger.error('API request failed', {
  endpoint: req.path,
  method: req.method,
  error: error.message,
  stack: error.stack
});

// Frontend logging
console.log('Component mounted', {
  component: 'BoatDetail',
  props: { slug: boatSlug },
  timestamp: new Date().toISOString()
});
```

### Error Tracking
```typescript
// Implement error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});
```
