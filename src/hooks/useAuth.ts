import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type AuthResult = { ok: true } | { ok: false; message: string };

type UseAuthResult = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

export const useAuth = (): UseAuthResult => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    loadSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { ok: false, message: getAuthErrorMessage(error.message) };
        }

        return { ok: true };
      } catch {
        return {
          ok: false,
          message: "Impossible de se connecter pour l'instant.",
        };
      }
    },
    [],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          return { ok: false, message: getAuthErrorMessage(error.message) };
        }

        return { ok: true };
      } catch {
        return {
          ok: false,
          message: "Impossible de créer le compte pour l'instant.",
        };
      }
    },
    [],
  );

  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut();
  }, []);

  return { session, user, isLoading, signInWithEmail, signUpWithEmail, signOut };
};

const getAuthErrorMessage = (message: string): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return 'Identifiants incorrects.';
  }

  if (normalized.includes('email not confirmed')) {
    return 'Merci de confirmer votre email avant de vous connecter.';
  }

  if (normalized.includes('user already registered')) {
    return 'Un compte existe déjà avec cet email.';
  }

  if (normalized.includes('password')) {
    return 'Mot de passe trop faible.';
  }

  if (normalized.includes('email')) {
    return 'Adresse email invalide.';
  }

  return "Une erreur est survenue. Réessaie plus tard.";
};
