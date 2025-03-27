import { PostgrestError } from "@supabase/supabase-js";
import { SupabaseApi } from "../api/supabaseApi";

export class SupabaseService {
  private client: SupabaseApi;

  constructor() {
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;

    this.client = new SupabaseApi(supabaseUrl as string, supabaseKey as string);
  }
  public async insertData<T>(table: string, insertData: T): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    return this.client.insert<T>(table, insertData);
  }
  public async upsertData<T>(table: string, insertData: T): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    return this.client.upsert<T>(table, insertData);
  }
}
