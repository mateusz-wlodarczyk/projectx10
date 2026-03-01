"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Global mocks for backend testing
vitest_1.vi.mock('@supabase/supabase-js', () => ({
    createClient: vitest_1.vi.fn(() => ({
        auth: {
            getUser: vitest_1.vi.fn(),
            signInWithPassword: vitest_1.vi.fn(),
            signUp: vitest_1.vi.fn(),
            signOut: vitest_1.vi.fn(),
        },
        from: vitest_1.vi.fn(() => ({
            select: vitest_1.vi.fn().mockReturnThis(),
            insert: vitest_1.vi.fn().mockReturnThis(),
            update: vitest_1.vi.fn().mockReturnThis(),
            delete: vitest_1.vi.fn().mockReturnThis(),
            eq: vitest_1.vi.fn().mockReturnThis(),
            single: vitest_1.vi.fn(),
            then: vitest_1.vi.fn(),
        })),
    })),
}));
// Mock environment variables
vitest_1.vi.stubGlobal('process', {
    ...process,
    env: {
        ...process.env,
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_ANON_KEY: 'test-anon-key',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
        PORT: '3001',
        NODE_ENV: 'test',
    },
});
// Mock Google Cloud Logging
vitest_1.vi.mock('@google-cloud/logging', () => ({
    Logging: vitest_1.vi.fn(() => ({
        log: vitest_1.vi.fn(() => ({
            write: vitest_1.vi.fn(),
        })),
    })),
}));
// Mock external API calls
vitest_1.vi.mock('axios', () => ({
    default: {
        create: vitest_1.vi.fn(() => ({
            get: vitest_1.vi.fn(),
            post: vitest_1.vi.fn(),
            put: vitest_1.vi.fn(),
            delete: vitest_1.vi.fn(),
        })),
        get: vitest_1.vi.fn(),
        post: vitest_1.vi.fn(),
        put: vitest_1.vi.fn(),
        delete: vitest_1.vi.fn(),
    },
}));
