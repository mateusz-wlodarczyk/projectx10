import { SupabaseClient, PostgrestError, createClient } from "@supabase/supabase-js";

export class SupabaseApi {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }
  //INSERT
  public async insert<T>(tableName: string, insertData: T): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    const { data, error } = await this.client.from(tableName).insert([insertData]).select();
    return { data, error };
  }
  //UPSERT
  public async upsert<T>(tableName: string, insertData: T): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    const { data, error } = await this.client.from(tableName).upsert([insertData]).select();
    return { data, error };
  }
}
