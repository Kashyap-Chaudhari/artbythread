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
  return (
    userIdInput.trim() === ADMIN_CREDENTIALS.userId &&
    passwordInput.trim() === ADMIN_CREDENTIALS.password
  );
}

export function saveAdminSession(userId: string): void {
  if (typeof window !== "undefined") {
    const user: AdminUser = {
      userId: userId.trim(),
      name: "Henvi & Kashyap",
      role: "Studio Master Admin",
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, "authenticated_" + Date.now());
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    document.cookie = `${AUTH_STORAGE_KEY}=true; path=/; max-age=604800; SameSite=Lax`;
  }
}

export function clearAdminSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    document.cookie = `${AUTH_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  return Boolean(token && token.startsWith("authenticated_"));
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_DATA_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as AdminUser;
  } catch {
    return null;
  }
}
