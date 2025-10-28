import { PostgrestError, AuthError } from "@supabase/supabase-js";
import { RepositoryService } from "../api/RepositoryService";
import { BoatPrice, WeekData } from "../types/savedBoatsResults";
import { WeeklyPriceHistory } from "../types/priceBoat";

export class SupabaseService {
  public client: RepositoryService | null = null;
  public adminClient: RepositoryService | null = null;
  public isConfigured: boolean = false;

  constructor() {
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("[SupabaseService] Initializing...");
    console.log("[SupabaseService] SUPABASE_URL:", supabaseUrl);
    console.log("[SupabaseService] SUPABASE_KEY:", supabaseKey ? "SET" : "NOT SET");
    console.log("[SupabaseService] SUPABASE_SERVICE_ROLE_KEY:", serviceRoleKey ? "SET" : "NOT SET");

    if (!supabaseKey || !supabaseUrl) {
      console.warn("[SupabaseService] Supabase credentials not found in environment variables. Running in mock mode.");
      this.isConfigured = false;
      return;
    }

    try {
      // Use anon key for regular operations
      this.client = new RepositoryService(supabaseUrl, supabaseKey);

      // Use service role key for admin operations (if available)
      if (serviceRoleKey) {
        this.adminClient = new RepositoryService(supabaseUrl, serviceRoleKey);
      } else {
        console.warn("[SupabaseService] Service role key not found, admin operations may fail");
        this.adminClient = this.client; // Fallback to anon key
      }

      this.isConfigured = true;
      console.log("[SupabaseService] Supabase service initialized successfully");

      // Test connection
      this.testConnection();
    } catch (error) {
      console.error("[SupabaseService] Failed to initialize Supabase service:", error);
      this.isConfigured = false;
    }
  }

  private async testConnection(): Promise<void> {
    if (!this.client) return;

    try {
      console.log("[SupabaseService] Testing connection...");
      // Simple query to test connection
      const { error } = await this.client.supabase.from("boats_list").select("count").limit(1);
      if (error) {
        console.warn("[SupabaseService] Connection test failed:", error.message);
      } else {
        console.log("[SupabaseService] Connection test successful");
      }
    } catch (error) {
      console.warn("[SupabaseService] Connection test error:", error);
    }
  }

  // Get the supabase client for direct access
  public get supabase() {
    if (!this.client) {
      throw new Error("Supabase client not initialized. Check environment variables.");
    }
    return this.client.supabase;
  }

  // Get the admin supabase client for admin operations
  public get adminSupabase() {
    if (!this.adminClient) {
      throw new Error("Supabase admin client not initialized. Check environment variables.");
    }
    return this.adminClient.supabase;
  }

  // Authentication methods
  public async signUp(
    email: string,
    password: string,
    userData: {
      firstName: string;
      lastName: string;
    },
  ) {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
      },
    });
    return { data, error };
  }

  public async signIn(email: string, password: string) {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  public async signOut() {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }
    const { error } = await this.client.auth.signOut();
    return { error };
  }

  public async resetPassword(email: string) {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }
    const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/auth/reset-password`,
    });
    return { data, error };
  }

  public async updatePassword(accessToken: string, newPassword: string) {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }
    const { data, error } = await this.client.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  }

  public async insertWeekDataIfNotExist(
    tableName: string,
    updatedColumnValue: BoatPrice,
    slug: string,
    weekKey: string,
  ): Promise<{ data: BoatPrice[] | null; error: PostgrestError | null }> {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }
    return this.client.insertWeekDataIfNotExist<BoatPrice>(tableName, updatedColumnValue, slug, weekKey);
  }

  public async updateWeekData(
    tableName: string,
    updatedColumnName: string,
    updatedColumnValue: BoatPrice,
    eqCondition: string,
    eqConditionValue: string,
  ): Promise<{ data: BoatPrice[] | null; error: PostgrestError | null }> {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }
    return this.client.update<BoatPrice>(tableName, updatedColumnName, updatedColumnValue, eqCondition, eqConditionValue);
  }

  public async upsertData<T>(table: string, insertData: T): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }
    return this.client.upsert<T>(table, insertData);
  }

  public async selectData(
    tableName: string,
    selectValue: string = "*",
    conditions?: { column: string; value: string }[],
  ): Promise<{ data: (WeeklyPriceHistory | { slug: string })[] | WeekData | null; error: PostgrestError | null }> {
    if (!this.client) {
      console.warn(`[SupabaseService] Client not initialized, returning null data for table: ${tableName}`);
      return { data: null, error: null };
    }

    try {
      console.log(`[SupabaseService] Selecting data from table: ${tableName}`);
      const result = await this.client.select<WeeklyPriceHistory | { slug: string }>(tableName, selectValue, conditions);

      if (result.error) {
        console.error(`[SupabaseService] Error selecting data from ${tableName}:`, result.error);
      } else {
        console.log(
          `[SupabaseService] Successfully selected data from ${tableName}, count: ${Array.isArray(result.data) ? result.data.length : "N/A"}`,
        );
      }

      return result;
    } catch (error) {
      console.error(`[SupabaseService] Exception selecting data from ${tableName}:`, error);
      return { data: null, error: error as PostgrestError };
    }
  }
}
