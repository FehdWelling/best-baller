import { supabase } from '../lib/supabaseClient';
import { Session } from '../models/types';
import { mergeSessions } from './sessionMerge';
import { parseSessionPayload } from './sessionValidation';

type SessionRow = {
  id: string;
  payload: unknown;
};

export { mergeSessions };

export const fetchCloudSessions = async (userId: string): Promise<Session[]> => {
  const { data, error } = await supabase
    .from('sessions')
    .select('id,payload')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as SessionRow[];

  return rows
    .map((row) => parseSessionPayload(row.payload, row.id))
    .filter((item): item is Session => item !== null);
};

export const upsertCloudSession = async (
  userId: string,
  session: Session,
): Promise<void> => {
  const { error } = await supabase.from('sessions').upsert(
    {
      id: session.id,
      user_id: userId,
      payload: session,
    },
    { onConflict: 'id' },
  );

  if (error) {
    throw error;
  }
};

export const deleteCloudSession = async (
  userId: string,
  sessionId: string,
): Promise<void> => {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('user_id', userId)
    .eq('id', sessionId);

  if (error) {
    throw error;
  }
};

export const clearCloudSessions = async (userId: string): Promise<void> => {
  const { error } = await supabase.from('sessions').delete().eq('user_id', userId);

  if (error) {
    throw error;
  }
};
