import { initializeApp, getApps, getApp, type FirebaseApp } from '@firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
  type ConfirmationResult,
} from '@firebase/auth';

/**
 * Firebase Client Configuration
 * Supports environment variables or graceful fallback if keys are pending.
 * Firebase Phone Auth provides up to 10,000 free SMS/month globally.
 */
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyAu2YJ1jTXZIitj2sN2FvYHqoMbK8ni69w',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'petziqq.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    'petziqq',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'petziqq.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    '379754270949',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:379754270949:web:d6996f1ba1da474ae7440c',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('placeholder')
);

let firebaseApp: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (!isFirebaseConfigured) return null;

  if (!firebaseApp) {
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }

  if (!firebaseAuthInstance && firebaseApp) {
    firebaseAuthInstance = getAuth(firebaseApp);
    firebaseAuthInstance.useDeviceLanguage();
  }

  return firebaseAuthInstance;
}

// Global active confirmation result to verify incoming OTP code
let currentConfirmationResult: ConfirmationResult | null = null;
let currentRecaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Initialize invisible or visible reCAPTCHA on the specified DOM element ID.
 */
export function getRecaptchaVerifier(containerId: string): RecaptchaVerifier | null {
  const auth = getFirebaseAuth();
  if (!auth) return null;

  try {
    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = containerId;
      document.body.appendChild(el);
    } else {
      // Clear previous reCAPTCHA widget DOM tree to avoid "already been rendered" error
      el.innerHTML = '';
    }

    if (currentRecaptchaVerifier) {
      try {
        currentRecaptchaVerifier.clear();
      } catch {
        // ignore
      }
      currentRecaptchaVerifier = null;
    }

    currentRecaptchaVerifier = new RecaptchaVerifier(auth, el, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        // expired
      },
    });

    return currentRecaptchaVerifier;
  } catch (err: any) {
    console.error('Failed to initialize RecaptchaVerifier:', err);
    return null;
  }
}

/**
 * Request real SMS OTP to phone number using Firebase Phone Auth.
 * Automatically formats 10-digit Indian numbers to E.164 (+91XXXXXXXXXX).
 */
export async function sendFirebasePhoneOtp(
  rawPhone: string,
  containerId: string = 'recaptcha-container'
): Promise<{ success: boolean; error: string | null }> {
  try {
    const auth = getFirebaseAuth();
    if (!auth || !isFirebaseConfigured) {
      return {
        success: false,
        error:
          'Firebase Phone Auth credentials not configured. Please add VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID.',
      };
    }

    const clean = rawPhone.replace(/\D/g, '');
    if (clean.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    // Default to +91 (India) if 10 digits
    const formatted = clean.length === 10 ? `+91${clean}` : `+${clean}`;

    const appVerifier = getRecaptchaVerifier(containerId);
    if (!appVerifier) {
      return { success: false, error: 'Could not initialize reCAPTCHA verifier. Please refresh the page.' };
    }

    const confirmationResult = await signInWithPhoneNumber(auth, formatted, appVerifier);
    currentConfirmationResult = confirmationResult;

    return { success: true, error: null };
  } catch (err: any) {
    console.error('sendFirebasePhoneOtp error:', err);
    let msg = 'Failed to send SMS OTP.';
    if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('region enabled')) {
      msg = 'SMS region not enabled in Firebase Console. Go to Firebase Console > Authentication > Settings > SMS Region Policy and enable India (+91).';
    } else if (err?.code === 'auth/invalid-phone-number') {
      msg = 'Invalid phone number format.';
    } else if (err?.code === 'auth/too-many-requests') {
      msg = 'Too many requests. Please wait a moment before requesting another code.';
    } else if (err?.code === 'auth/quota-exceeded') {
      msg = 'Monthly SMS quota limit reached.';
    } else if (err?.code === 'auth/captcha-check-failed') {
      msg = 'reCAPTCHA verification failed. Please refresh and try again.';
    } else if (err?.code === 'auth/app-not-authorized') {
      msg = 'Domain not authorized in Firebase Console > Authentication > Settings > Authorized domains.';
    } else if (err?.message?.includes('already been rendered')) {
      msg = 'Verification widget reset. Please click Send Security Code again.';
    } else if (err?.message) {
      msg = err.message;
    }
    return { success: false, error: msg };
  }
}

/**
 * Verify received SMS OTP code via Firebase confirmation result.
 */
export async function verifyFirebasePhoneOtp(
  code: string
): Promise<{ success: boolean; error: string | null; user?: any }> {
  try {
    if (!currentConfirmationResult) {
      return {
        success: false,
        error: 'No active OTP verification session. Please request a new code.',
      };
    }

    const result = await currentConfirmationResult.confirm(code.trim());
    return { success: true, error: null, user: result.user };
  } catch (err: any) {
    console.error('verifyFirebasePhoneOtp error:', err);
    let msg = 'Invalid or expired verification code.';
    if (err?.code === 'auth/invalid-verification-code') {
      msg = 'Invalid verification code. Please check and try again.';
    } else if (err?.code === 'auth/code-expired') {
      msg = 'Verification code has expired. Please request a new code.';
    } else if (err?.message) {
      msg = err.message;
    }
    return { success: false, error: msg };
  }
}

