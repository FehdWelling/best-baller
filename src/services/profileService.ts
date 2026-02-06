import { supabase } from '../lib/supabaseClient';

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;

type ProfileRow = {
  user_id: string;
  username: string | null;
};

export type UsernameInput = {
  username: string;
};

export type UsernameValidationResult =
  | { ok: true; username: string }
  | { ok: false; message: string };

export const normalizeUsername = (username: string): string => username.trim().toLowerCase();

export const validateUsername = (username: string): UsernameValidationResult => {
  const normalized = normalizeUsername(username);

  if (normalized.length < USERNAME_MIN_LENGTH || normalized.length > USERNAME_MAX_LENGTH) {
    return {
      ok: false,
      message: `Le pseudo doit contenir entre ${USERNAME_MIN_LENGTH} et ${USERNAME_MAX_LENGTH} caractères.`,
    };
  }

  return { ok: true, username: normalized };
};

export const getMyProfile = async (userId: string): Promise<ProfileRow | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, username')
    .eq('user_id', userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    throw new Error("Impossible de récupérer le profil.");
  }

  return data;
};

export const upsertMyProfile = async (
  userId: string,
  input: UsernameInput,
): Promise<ProfileRow> => {
  const validation = validateUsername(input.username);

  if (validation.ok === false) {
    throw new Error(validation.message);
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        user_id: userId,
        username: validation.username,
      },
      {
        onConflict: 'user_id',
      },
    )
    .select('user_id, username')
    .single<ProfileRow>();

  if (error) {
    throw new Error("Impossible d'enregistrer le profil.");
  }

  return data;
};

export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  const validation = validateUsername(username);

  if (validation.ok === false) {
    return false;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('username', validation.username)
    .maybeSingle<{ user_id: string }>();

  if (error) {
    throw new Error("Impossible de vérifier le pseudo.");
  }

  return !data;
};
