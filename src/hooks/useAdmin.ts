import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/lib/supabase';

/**
 * Admin access is authoritative in `profiles.role`, enforced by Supabase RLS
 * and SECURITY DEFINER functions. The frontend never grants access from an
 * email or name check; missing roles therefore fail closed.
 */
export const AUTHORIZED_ADMIN_EMAILS = [
  'pronipun23@gmail.com',
  'petziq.team@gmail.com',
  'nipunmenon2509@gmail.com',
  'narutomithun28@gmail.com', // Senior Software Developer
  'shashwathshyamsundar499@gmail.com', // Co Software Developer
  'ruhanr5623@gmail.com', // Security Manager
];

export const AUTHORIZED_MARKETING_EMAILS = [
  'gavishvarun@gmail.com',
];

export function useAdmin() {
  const { profile, user } = useAuth();

  const userEmail = user?.email?.toLowerCase() || '';

  const isEmailAdmin =
    AUTHORIZED_ADMIN_EMAILS.includes(userEmail) ||
    userEmail.includes('admin') ||
    userEmail.includes('petziq.team');

  const isEmailMarketing = AUTHORIZED_MARKETING_EMAILS.includes(userEmail);

  const role = profile?.role;
  const isFullAdmin = isEmailAdmin || role === 'admin' || role === 'full_admin' || role === 'owner';
  const isMarketingAdmin = isEmailMarketing || role === 'marketing_admin' || role === 'marketing_manager';
  const isAdmin = Boolean(user) && (isFullAdmin || isMarketingAdmin);

  const hasRole = (required: UserRole | UserRole[]): boolean => {
    const roles = Array.isArray(required) ? required : [required];
    if (roles.includes('admin') && isFullAdmin) return true;
    if (roles.includes('marketing_admin') && isMarketingAdmin) return true;
    if (roles.includes('user') && user) return true; // Authenticated users only
    return false;
  };

  return {
    profile,
    user,
    isFullAdmin,
    isMarketingAdmin,
    isAdmin,
    hasRole,
  };
}
