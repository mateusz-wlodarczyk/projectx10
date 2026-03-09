import { SupabaseService } from "./SupabaseService";
import { NoteRowWithUser, NoteApi, GetNotesResult } from "../types/note";

const NOTES_TABLE = "notes";

/**
 * Fetches and manages notes from Supabase public.notes table.
 * Notes are tied to users via user_id.
 */
export class NoteService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get all notes with creator info (join users).
   */
  async getNotes(): Promise<GetNotesResult> {
    const client = this.supabaseService.adminSupabase;
    const { data, error } = await client
      .from(NOTES_TABLE)
      .select(
        "id, user_id, notes, created_at, updated_at, users!notes_user_id_fkey(email, first_name, last_name)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[NoteService] Error fetching notes:", error);
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }

    const rows = (data ?? []) as NoteRowWithUser[];
    const notes: NoteApi[] = rows.map((row) => this.toApi(row));
    return { notes, total: notes.length };
  }

  /**
   * Create a note for a user.
   */
  async createNote(notes: string, userId: string): Promise<NoteApi> {
    const client = this.supabaseService.adminSupabase;
    const { data, error } = await client
      .from(NOTES_TABLE)
      .insert([{ notes: notes.trim(), user_id: userId }])
      .select("id, user_id, notes, created_at, updated_at")
      .single();

    if (error) {
      console.error("[NoteService] Error creating note:", error);
      throw new Error(`Failed to create note: ${error.message}`);
    }
    return this.toApi(data as NoteRowWithUser);
  }

  /**
   * Update note content (and updated_at).
   */
  async updateNote(id: number | string, notes: string): Promise<NoteApi> {
    const client = this.supabaseService.adminSupabase;
    const { data, error } = await client
      .from(NOTES_TABLE)
      .update({ notes: notes.trim(), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, user_id, notes, created_at, updated_at")
      .single();

    if (error) {
      console.error("[NoteService] Error updating note:", error);
      throw new Error(`Failed to update note: ${error.message}`);
    }
    return this.toApi(data as NoteRowWithUser);
  }

  /**
   * Delete a note by id.
   */
  async deleteNote(id: number | string): Promise<void> {
    const client = this.supabaseService.adminSupabase;
    const { error } = await client.from(NOTES_TABLE).delete().eq("id", id);
    if (error) {
      console.error("[NoteService] Error deleting note:", error);
      throw new Error(`Failed to delete note: ${error.message}`);
    }
  }

  private toApi(row: NoteRowWithUser): NoteApi {
    const users = row.users;
    const createdBy =
      users && (users.email != null || users.first_name != null || users.last_name != null)
        ? {
            email: users.email ?? "",
            firstName: users.first_name ?? "",
            lastName: users.last_name ?? "",
          }
        : undefined;
    return {
      id: row.id,
      userId: row.user_id,
      notes: row.notes ?? "",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy,
    };
  }
}
