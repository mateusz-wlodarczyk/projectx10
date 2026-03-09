/**
 * Row from Supabase public.users table (snake_case as in DB).
 */
export interface UserRow {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

/**
 * User as returned by the API (camelCase for frontend).
 */
export interface UserApi {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface GetUsersResult {
  users: UserApi[];
  total: number;
}
