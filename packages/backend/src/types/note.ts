/**
 * Row from Supabase public.notes table (snake_case as in DB).
 */
export interface NoteRow {
  id: number;
  user_id: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

/**
 * User snippet from join (optional, when joined with users table).
 */
export interface NoteUserRow {
  email?: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Note with optional created_by from join.
 */
export interface NoteRowWithUser extends NoteRow {
  users?: NoteUserRow | null;
}

/**
 * Note as returned by the API (camelCase, with createdBy for display).
 */
export interface NoteApi {
  id: number;
  userId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface GetNotesResult {
  notes: NoteApi[];
  total: number;
}
