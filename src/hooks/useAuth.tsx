import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, type Profile } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  pendingRedirect: string | null;
  setPendingRedirect: (path: string | null) => void;
  consumePendingRedirect: () => string | null;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    petName: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
  });
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const consumePendingRedirect = useCallback(() => {
    const target = pendingRedirect;
    setPendingRedirect(null);
    return target;
  }, [pendingRedirect]);

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, pet_name, created_at, role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Failed to load profile:', error.message);
        return null;
      }

      return data as Profile | null;
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      try {
        const raw = localStorage.getItem('petziq_local_auth');
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved?.session && saved?.profile) {
            setState({
              session: saved.session,
              user: saved.session.user,
              profile: saved.profile,
              loading: false,
            });
            return;
          }
        }
      } catch {
        // ignore
      }
      setState({ session: null, user: null, profile: null, loading: false });
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      if (session) {
        const profile = await fetchProfile(session.user.id);

        if (!mounted) return;

        setState({
          session,
          user: session.user,
          profile,
          loading: false,
        });
      } else {
        setState({
          session: null,
          user: null,
          profile: null,
          loading: false,
        });
      }
    }).catch(() => {
      if (!mounted) return;
      setState({ session: null, user: null, profile: null, loading: false });
    });

    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const result = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;

        if (session) {
          fetchProfile(session.user.id).then((profile) => {
            if (!mounted) return;

            setState({
              session,
              user: session.user,
              profile,
              loading: false,
            });
          });
        } else {
          setState({
            session: null,
            user: null,
            profile: null,
            loading: false,
          });
        }
      });
      subscription = result.data.subscription;
    } catch {
      // Supabase auth not available — continue without auth state listener
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      petName: string,
    ): Promise<{ error: string | null }> => {
      if (!isSupabaseConfigured) {
        // Fallback local registration so users can register and use Petziq seamlessly without missing env keys
        const mockUserId = `local-${Date.now()}`;
        const newProfile: Profile = {
          id: mockUserId,
          full_name: fullName,
          pet_name: petName,
          created_at: new Date().toISOString(),
          role: email.toLowerCase().includes('admin') || email.toLowerCase().includes('petziq') ? 'admin' : 'user',
        };

        const mockUser: User = {
          id: mockUserId,
          app_metadata: {},
          user_metadata: { full_name: fullName, pet_name: petName },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email,
        };

        const mockSession: Session = {
          access_token: `mock-token-${Date.now()}`,
          refresh_token: `mock-refresh-${Date.now()}`,
          expires_in: 3600,
          token_type: 'bearer',
          user: mockUser,
        };

        try {
          localStorage.setItem('petziq_local_auth', JSON.stringify({ session: mockSession, profile: newProfile, password }));
        } catch {
          // ignore
        }

        setState({
          session: mockSession,
          user: mockUser,
          profile: newProfile,
          loading: false,
        });

        return { error: null };
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              pet_name: petName,
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        if (!data.user) {
          return { error: 'Registration failed — no user returned.' };
        }

        // Best-effort profile creation; ignore errors (RLS may block if anon)
        await supabase
          .from('profiles')
          .upsert(
            {
              id: data.user.id,
              full_name: fullName,
              pet_name: petName,
            },
            { onConflict: 'id' },
          );

        return { error: null };
      } catch (e) {
        console.error('signUp threw:', e);
        return { error: 'Unable to connect to authentication service. Please try again later.' };
      }
    },
    [],
  );

  const signIn = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ error: string | null }> => {
      if (!isSupabaseConfigured) {
        // Fallback local login
        try {
          const raw = localStorage.getItem('petziq_local_auth');
          if (raw) {
            const saved = JSON.parse(raw);
            if (saved?.session?.user?.email?.toLowerCase() === email.toLowerCase()) {
              setState({
                session: saved.session,
                user: saved.session.user,
                profile: saved.profile,
                loading: false,
              });
              return { error: null };
            }
          }
        } catch {
          // ignore
        }

        const normEmail = email.toLowerCase().trim();
        const isAdminEmail = [
          'pronipun23@gmail.com',
          'petziq.team@gmail.com',
          'nipunmenon2509@gmail.com',
          'narutomithun28@gmail.com',
          'shashwathshyamsundar499@gmail.com',
          'ruhanr5623@gmail.com',
        ].includes(normEmail) || normEmail.includes('admin') || normEmail.includes('petziq');
        const isMarketingEmail = normEmail === 'gavishvarun@gmail.com';

        const mockUserId = `local-${Date.now()}`;
        const newProfile: Profile = {
          id: mockUserId,
          full_name: email.split('@')[0] || 'User',
          pet_name: '',
          created_at: new Date().toISOString(),
          role: isAdminEmail ? 'admin' : isMarketingEmail ? 'marketing_admin' : 'user',
        };

        const mockUser: User = {
          id: mockUserId,
          app_metadata: {},
          user_metadata: { full_name: newProfile.full_name, pet_name: '' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email,
        };

        const mockSession: Session = {
          access_token: `mock-token-${Date.now()}`,
          refresh_token: `mock-refresh-${Date.now()}`,
          expires_in: 3600,
          token_type: 'bearer',
          user: mockUser,
        };

        try {
          localStorage.setItem('petziq_local_auth', JSON.stringify({ session: mockSession, profile: newProfile }));
        } catch {
          // ignore
        }

        setState({
          session: mockSession,
          user: mockUser,
          profile: newProfile,
          loading: false,
        });

        return { error: null };
      }

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        return { error: null };
      } catch (e) {
        console.error('signIn threw:', e);
        return { error: 'Unable to connect to authentication service. Please try again later.' };
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('petziq_local_auth');
      setState({
        session: null,
        user: null,
        profile: null,
        loading: false,
      });
    } catch (e) {
      console.error('signOut threw:', e);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        pendingRedirect,
        setPendingRedirect,
        consumePendingRedirect,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}