import { SupabaseService } from "./SupabaseService";
import { UserRow, UserApi, GetUsersResult } from "../types/user";

const USERS_TABLE = "users";

/**
 * Fetches users from Supabase public.users table.
 * Use admin client so RLS allows read.
 */
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get all users from public.users table.
   */
  async getUsers(): Promise<GetUsersResult> {
    const client = this.supabaseService.adminSupabase;
    const { data, error } = await client
      .from(USERS_TABLE)
      .select("id, email, first_name, last_name, role, email_verified, created_at, updated_at, last_login_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[UserService] Error fetching users:", error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    const rows = (data ?? []) as UserRow[];
    const users: UserApi[] = rows.map((row) => this.toApi(row));
    return { users, total: users.length };
  }

  private toApi(row: UserRow): UserApi {
    return {
      id: row.id,
      email: row.email ?? "",
      firstName: row.first_name ?? "",
      lastName: row.last_name ?? "",
      role: row.role ?? "user",
      emailVerified: row.email_verified ?? false,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLoginAt: row.last_login_at ?? null,
    };
  }
}
