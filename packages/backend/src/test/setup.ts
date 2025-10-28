import { vi } from 'vitest'

// Global mocks for backend testing
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      then: vi.fn(),
    })),
  })),
}))

// Mock environment variables
vi.stubGlobal('process', {
  ...process,
  env: {
    ...process.env,
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    PORT: '3001',
    NODE_ENV: 'test',
  },
})

// Mock Google Cloud Logging
vi.mock('@google-cloud/logging', () => ({
  Logging: vi.fn(() => ({
    log: vi.fn(() => ({
      write: vi.fn(),
    })),
  })),
}))

// Mock external API calls
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))