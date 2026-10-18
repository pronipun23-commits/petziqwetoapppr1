import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, type Profile } from '@/lib/supabase';
import {
  isFirebaseConfigured,
  sendFirebasePhoneOtp,
  verifyFirebasePhoneOtp,
} from '@/lib/firebaseAuth';

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
    petName: string,
    phone?: string,
    dateOfBirth?: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  sendPhoneOtp: (phone: string, containerId?: string) => Promise<{ error: string | null; demoCode?: string; method?: 'firebase_sms' | 'supabase_sms' | 'demo' }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: string | null }>;
  sendEmailOtp: (email: string) => Promise<{ error: string | null }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: string | null }>;
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
      // Check if schema was previously detected to lack phone/date_of_birth
      const schemaMissingColumns = sessionStorage.getItem('petziq_schema_no_phone') === 'true';

      let res;
      if (!schemaMissingColumns) {
        res = await supabase
          .from('profiles')
          .select('id, full_name, pet_name, created_at, role, phone, date_of_birth')
          .eq('id', userId)
          .maybeSingle();

        if (res.error) {
          sessionStorage.setItem('petziq_schema_no_phone', 'true');
          res = await supabase
            .from('profiles')
            .select('id, full_name, pet_name, created_at, role')
            .eq('id', userId)
            .maybeSingle();
        }
      } else {
        res = await supabase
          .from('profiles')
          .select('id, full_name, pet_name, created_at, role')
          .eq('id', userId)
          .maybeSingle();
      }

      if (res.error) {
        console.warn('Failed to load profile from Supabase:', res.error.message);
        return null;
      }

      const prof = res.data as Profile | null;
      if (!prof) return null;

      // Augment with locally stored phone / date_of_birth if Supabase database schema has not migrated yet
      try {
        const localRegistered = JSON.parse(localStorage.getItem('petziq_registered_profiles') || '{}');
        const localData = localRegistered[userId];
        if (localData) {
          if (!prof.phone && localData.phone) prof.phone = localData.phone;
          if (!prof.date_of_birth && localData.dateOfBirth) prof.date_of_birth = localData.dateOfBirth;
        }
      } catch {
        // ignore
      }

      return prof;
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
      phone?: string,
      dateOfBirth?: string,
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
          phone,
          date_of_birth: dateOfBirth,
        };

        const mockUser: User = {
          id: mockUserId,
          app_metadata: {},
          user_metadata: { full_name: fullName, pet_name: petName, phone, date_of_birth: dateOfBirth },
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
          // Also persist to customer profiles list for Admin visibility
          const localProfiles = JSON.parse(localStorage.getItem('petziq_registered_profiles') || '[]');
          localProfiles.push(newProfile);
          localStorage.setItem('petziq_registered_profiles', JSON.stringify(localProfiles));
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
              phone,
              date_of_birth: dateOfBirth,
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        if (!data.user) {
          return { error: 'Registration failed — no user returned.' };
        }

        // Best-effort profile creation
        await supabase
          .from('profiles')
          .upsert(
            {
              id: data.user.id,
              full_name: fullName,
              pet_name: petName,
              phone,
              date_of_birth: dateOfBirth,
            },
            { onConflict: 'id' },
          );

        // Also save to registered profiles backup
        try {
          const localProfiles = JSON.parse(localStorage.getItem('petziq_registered_profiles') || '[]');
          localProfiles.push({
            id: data.user.id,
            full_name: fullName,
            pet_name: petName,
            created_at: new Date().toISOString(),
            role: 'user',
            phone,
            date_of_birth: dateOfBirth,
          });
          localStorage.setItem('petziq_registered_profiles', JSON.stringify(localProfiles));
        } catch {
          // ignore
        }

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

  const updateProfile = useCallback(
    async (updates: Partial<Profile>): Promise<{ error: string | null }> => {
      try {
        if (!state.user && !state.profile) {
          return { error: 'Not logged in.' };
        }
        const userId = state.user?.id || state.profile?.id || 'current';

        if (isSupabaseConfigured) {
          const schemaMissingColumns = sessionStorage.getItem('petziq_schema_no_phone') === 'true';
          const remoteUpdates = { ...updates };
          if (schemaMissingColumns) {
            delete (remoteUpdates as any).phone;
            delete (remoteUpdates as any).date_of_birth;
          }

          if (Object.keys(remoteUpdates).length > 0) {
            const { error } = await supabase.from('profiles').update(remoteUpdates).eq('id', userId);
            if (error) {
              if (error.message?.includes('phone') || error.message?.includes('column') || (error as any).code === '42703') {
                sessionStorage.setItem('petziq_schema_no_phone', 'true');
              } else {
                console.warn('Supabase update profile error, updating local state:', error.message);
              }
            }
          }
        }

        const updatedProfile = state.profile ? { ...state.profile, ...updates } : null;
        if (updatedProfile) {
          setState((prev) => ({ ...prev, profile: updatedProfile }));
          try {
            const raw = localStorage.getItem('petziq_local_auth');
            if (raw) {
              const saved = JSON.parse(raw);
              saved.profile = updatedProfile;
              localStorage.setItem('petziq_local_auth', JSON.stringify(saved));
            }
            // Also update in registered profiles list
            const localProfiles = JSON.parse(localStorage.getItem('petziq_registered_profiles') || '[]');
            const idx = localProfiles.findIndex((p: any) => p.id === userId);
            if (idx >= 0) {
              localProfiles[idx] = { ...localProfiles[idx], ...updates };
            } else {
              localProfiles.push(updatedProfile);
            }
            localStorage.setItem('petziq_registered_profiles', JSON.stringify(localProfiles));
          } catch {
            // ignore
          }
        }
        return { error: null };
      } catch (e: any) {
        return { error: e?.message || 'Failed to update profile.' };
      }
    },
    [state.user, state.profile],
  );

  const resetPassword = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      try {
        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/#/auth`,
          });
          if (error) return { error: error.message };
        }
        return { error: null };
      } catch (e: any) {
        return { error: e?.message || 'Failed to send reset link.' };
      }
    },
    [],
  );

  const sendPhoneOtp = useCallback(
    async (rawPhone: string, containerId: string = 'recaptcha-container'): Promise<{ error: string | null; demoCode?: string; method?: 'firebase_sms' | 'supabase_sms' | 'demo' }> => {
      try {
        const cleanDigits = rawPhone.replace(/\D/g, '');
        if (cleanDigits.length < 10) {
          return { error: 'Please enter a valid 10-digit mobile number.' };
        }
        // Format to E.164 (India default +91 if not specified)
        const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;

        // 1. Primary Free Real SMS Provider: Firebase Phone Auth (10,000 free SMS/mo)
        if (isFirebaseConfigured) {
          const res = await sendFirebasePhoneOtp(formattedPhone, containerId);
          if (res.success) {
            return { error: null, method: 'firebase_sms' };
          }
          console.error('Firebase Phone Auth error:', res.error);
          return { error: res.error || 'Failed to dispatch SMS to the provided number.', method: 'firebase_sms' };
        }

        // 2. Supabase SMS provider (if Twilio or MessageBird configured in Supabase dashboard)
        if (isSupabaseConfigured) {
          try {
            const { error } = await supabase.auth.signInWithOtp({
              phone: formattedPhone,
              options: {
                channel: 'sms',
              },
            });

            if (!error) {
              return { error: null, method: 'supabase_sms' };
            }

            return { error: error.message || 'Failed to dispatch SMS to your phone.' };
          } catch (e: any) {
            return { error: e?.message || 'Failed to dispatch SMS to your phone.' };
          }
        }

        return { error: 'SMS service is not configured. Please ensure SMS gateway credentials are provided.' };
      } catch (err: any) {
        return { error: err?.message || 'Failed to dispatch verification code.' };
      }
    },
    [],
  );

  const verifyPhoneOtp = useCallback(
    async (rawPhone: string, token: string): Promise<{ error: string | null }> => {
      try {
        const cleanDigits = rawPhone.replace(/\D/g, '');
        const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;
        const cleanToken = token.trim();

        if (cleanToken.length !== 6) {
          return { error: 'Please enter the complete 6-digit verification code.' };
        }

        // 1. Check active session OTP (e.g. WhatsApp verification) first
        const rawOtp = sessionStorage.getItem('petziq_active_otp');
        if (rawOtp) {
          try {
            const activeOtp = JSON.parse(rawOtp);

            // Check expiration (10 min TTL)
            if (Date.now() > activeOtp.expiresAt) {
              sessionStorage.removeItem('petziq_active_otp');
              return { error: 'Verification code has expired. Please request a new code.' };
            }

            // Check attempts limit (Max 3 failed attempts defense)
            if (activeOtp.attempts >= 3) {
              sessionStorage.removeItem('petziq_active_otp');
              return { error: 'Too many incorrect attempts. For your security, this code was locked.' };
            }

            if (activeOtp.code !== cleanToken) {
              activeOtp.attempts += 1;
              sessionStorage.setItem('petziq_active_otp', JSON.stringify(activeOtp));
              const remaining = 3 - activeOtp.attempts;
              return { error: `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.` };
            }

            // Verified successfully! Invalidate one-time token immediately
            sessionStorage.removeItem('petziq_active_otp');
            await updateProfile({ phone: cleanDigits });
            return { error: null };
          } catch {
            sessionStorage.removeItem('petziq_active_otp');
          }
        }

        // 2. Fallback to Firebase verification if active
        if (isFirebaseConfigured) {
          const fbRes = await verifyFirebasePhoneOtp(cleanToken);
          if (fbRes.success) {
            await updateProfile({ phone: cleanDigits });
            return { error: null };
          }
        }

        // 3. Fallback to Supabase SMS verifyOtp if active
        if (isSupabaseConfigured) {
          try {
            const { error } = await supabase.auth.verifyOtp({
              phone: formattedPhone,
              token: cleanToken,
              type: 'sms',
            });

            if (!error) {
              await updateProfile({ phone: cleanDigits });
              return { error: null };
            }
          } catch {
            // ignore
          }
        }

        return { error: 'Invalid verification code. Please check and try again.' };
      } catch (err: any) {
        return { error: err?.message || 'Verification failed.' };
      }
    },
    [updateProfile],
  );

  const sendEmailOtp = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      try {
        if (!isSupabaseConfigured) {
          return { error: 'Email service is not configured.' };
        }
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
        });
        if (error) return { error: error.message };
        return { error: null };
      } catch (err: any) {
        return { error: err?.message || 'Failed to dispatch email verification code.' };
      }
    },
    [],
  );

  const verifyEmailOtp = useCallback(
    async (email: string, token: string): Promise<{ error: string | null }> => {
      try {
        if (!isSupabaseConfigured) {
          return { error: 'Email service is not configured.' };
        }
        const { error } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: token.trim(),
          type: 'email',
        });
        if (error) return { error: error.message };
        return { error: null };
      } catch (err: any) {
        return { error: err?.message || 'Verification failed.' };
      }
    },
    [],
  );

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
        updateProfile,
        resetPassword,
        sendPhoneOtp,
        verifyPhoneOtp,
        sendEmailOtp,
        verifyEmailOtp,
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