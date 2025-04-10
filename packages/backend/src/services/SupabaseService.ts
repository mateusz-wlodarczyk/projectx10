import { PostgrestError } from "@supabase/supabase-js";
import { RepositoryService } from "../api/RepositoryService";
import { BoatPrice } from "../types/savedBoatsResults";

export class SupabaseService {
  private client: RepositoryService;

  constructor() {
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;

    this.client = new RepositoryService(supabaseUrl as string, supabaseKey as string);
  }

  public async insertWeekDataIfNotExist(
    tableName: string,
    updatedColumnValue: BoatPrice,
    slug: string,
    weekKey: string,
  ): Promise<{ data: BoatPrice[] | null; error: PostgrestError | null }> {
    return this.client.insertWeekDataIfNotExist<BoatPrice>(tableName, updatedColumnValue, slug, weekKey);
  }

  public async updateWeekData(
    tableName: string,
    updatedColumnName: string,
    updatedColumnValue: BoatPrice,
    eqCondition: string,
    eqConditionValue: string,
  ): Promise<{ data: BoatPrice[] | null; error: PostgrestError | null }> {
    return this.client.update<BoatPrice>(tableName, updatedColumnName, updatedColumnValue, eqCondition, eqConditionValue);
  }

  public async upsertData<T>(table: string, insertData: T): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    return this.client.upsert<T>(table, insertData);
  }

  public async selectData<T>(tableName: string, selectValue: string): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    return this.client.select<T>(tableName, selectValue);
  }

  public async selectSpecificData<T>(
    tableName: string,
    column_name: string,
    value: string,
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    return this.client.selectSpecificRow<T>(tableName, column_name, value);
  }
}
