import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolve the Supabase project URL and browser-safe public key from the
 * environment without caring which naming convention was used, so the
 * existing client (src/lib/supabase.ts) always receives them under the
 * canonical names VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
 *
 * Secrets are never logged and service-role/secret keys are explicitly
 * excluded from candidate matching.
 */

/**
 * Tolerant dotenv-line parser.
 *
 * Some sandbox .env files are written with a shape that standard dotenv
 * parsers read as zero variables, e.g. a duplicated "NAME:NAME=value" key or
 * a colon used in place of "=". Both shapes are normalized back to
 * KEY -> value here. Values are never printed.
 */
function parseEnvText(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Prefer '=' as separator; fall back to the first ':' when absent.
    let eq = line.indexOf('=');
    let sepLen = 1;
    if (eq === -1) {
      eq = line.indexOf(':');
      sepLen = 1;
      if (eq === -1) continue;
    }

    let key = line.slice(0, eq).trim().replace(/^export\s+/, '');
    let value = line.slice(eq + sepLen).trim();

    // Collapse duplicated keys like "NAME:NAME" (or NAME:NAME:NAME).
    if (key.includes(':')) {
      key = key.slice(key.lastIndexOf(':') + 1).trim();
    }

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}
function resolveSupabaseEnv(mode: string): { url: string; anonKey: string } {
  // Empty prefix = load every variable declared in .env/.env.local files
  // (config-side only; nothing here is printed or logged).
  const fileEnv = loadEnv(mode, process.cwd(), '');

  // Vite's dotenv parser silently yields nothing when a .env file is saved
  // with a BOM or a UTF-16 encoding. Parse .env ourselves, BOM-aware, so the
  // declared values are honored regardless of encoding. Values are never
  // printed or logged.
  const robustFileEnv: Record<string, string> = {};
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), '.env'));
    let text: string;
    if (buf[0] === 0xff && buf[1] === 0xfe) {
      text = buf.toString('utf16le').replace(/^\uFEFF/, '');
    } else if (buf[0] === 0xfe && buf[1] === 0xff) {
      text = buf.toString('utf16le').replace(/^\uFEFF/, '');
    } else {
      text = buf.toString('utf8').replace(/^\uFEFF/, '');
    }
    Object.assign(robustFileEnv, parseEnvText(text));
  } catch {
    // .env missing or unreadable — proceed without it.
  }

  const candidates: Record<string, string> = {
    ...robustFileEnv,
    ...fileEnv,
  };
  for (const [k, v] of Object.entries(process.env)) {
    if (typeof v === 'string' && !(k in candidates)) candidates[k] = v;
  }

  const isForbidden = (name: string) =>
    /SERVICE_ROLE|SERVICE_KEY|SERVER_|SECRET|PRIVATE/i.test(name);

  const pick = (ordered: (name: string, value: string) => boolean): string => {
    for (const [name, value] of Object.entries(candidates)) {
      if (value && !isForbidden(name) && ordered(name, value)) return value;
    }
    return '';
  };

  // Exact canonical names first, then common variants, then fuzzy match.
  const url = pick((name) =>
    name === 'VITE_SUPABASE_URL' ||
    name === 'SUPABASE_URL' ||
    name === 'NEXT_PUBLIC_SUPABASE_URL' ||
    (/SUPABASE/i.test(name) && /URL|PROJECT|ENDPOINT|HOST$/i.test(name)),
  );

  const anonKey = pick((name) =>
    name === 'VITE_SUPABASE_ANON_KEY' ||
    name === 'VITE_SUPABASE_PUBLISHABLE_KEY' ||
    name === 'SUPABASE_ANON_KEY' ||
    name === 'SUPABASE_PUBLISHABLE_KEY' ||
    name === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' ||
    name === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY' ||
    (/SUPABASE/i.test(name) && /ANON|PUBLISHABLE|PUBLIC|API_?KEY|(^|_)KEY$/i.test(name)),
  );

  return { url, anonKey };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { url, anonKey } = resolveSupabaseEnv(mode);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // Guarantee the canonical names exist for the existing Supabase client,
    // regardless of which naming convention the environment uses. Keeping the
    // default VITE_ envPrefix means no other (possibly private) variable name
    // is ever exposed to the browser bundle.
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(url),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(anonKey),
    },
    server: {
      // Sandbox previews reach the dev server through the container network
      // interface, so it must bind to all hosts instead of localhost only.
      // The platform injects PORT — honor it, and fall back to Vite's default.
      host: true,
      port: Number(process.env.PORT) || 5173,
    },
  };
});
