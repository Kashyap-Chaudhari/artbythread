import { supabase, isSupabaseConfigured } from "./supabase";

export const ADMIN_CREDENTIALS = {
  userId: process.env.NEXT_PUBLIC_ADMIN_USER_ID || "artbythread@7",
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Henviartbythread@7",
};

const AUTH_STORAGE_KEY = "artbythread_admin_session_token";
const USER_DATA_KEY = "artbythread_admin_user_data";

export interface AdminUser {
  userId: string;
  name: string;
  role: string;
  loginTime: string;
}

export function checkAdminCredentials(userIdInput: string, passwordInput: string): boolean {
  const u = (userIdInput || "").trim().toLowerCase();
  const p = (passwordInput || "").trim();
  const targetUser = ADMIN_CREDENTIALS.userId.trim().toLowerCase();
  const targetPass = ADMIN_CREDENTIALS.password.trim();

  return u === targetUser && p === targetPass;
}

export async function saveAdminSession(userId: string): Promise<void> {
  if (typeof window !== "undefined") {
    const user: AdminUser = {
      userId: userId.trim(),
      name: "Henvi",
      role: "Studio Master Admin",
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, "authenticated_" + Date.now());
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    document.cookie = `${AUTH_STORAGE_KEY}=true; path=/; max-age=604800; SameSite=Lax`;

    // Sync with Supabase Auth so that standard calls send the JWT token for RLS policies
    if (isSupabaseConfigured && supabase) {
      try {
        const email = "kashyapchaudhari299@gmail.com";
        const password = ADMIN_CREDENTIALS.password;

        // Try to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        // If user doesn't exist, sign up first
        if (signInError && (signInError.message.includes("Invalid login credentials") || signInError.message.includes("does not exist"))) {
          const { error: signUpError } = await supabase.auth.signUp({ email, password });
          if (!signUpError) {
            await supabase.auth.signInWithPassword({ email, password });
          }
        }
      } catch (authErr) {
        console.warn("[SUPABASE AUTH SYNC WARNING]", authErr);
      }
    }
  }
}

export function clearAdminSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    document.cookie = `${AUTH_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch((err) => console.warn("[SUPABASE AUTH SIGNOUT WARNING]", err));
    }
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  if (token && token.startsWith("authenticated_")) return true;
  if (document.cookie.includes(`${AUTH_STORAGE_KEY}=true`)) return true;
  return false;
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_DATA_KEY);
  if (!data) {
    return {
      userId: "artbythread@7",
      name: "Henvi",
      role: "Studio Master Admin",
      loginTime: new Date().toISOString(),
    };
  }
  try {
    return JSON.parse(data) as AdminUser;
  } catch {
    return null;
  }
}
